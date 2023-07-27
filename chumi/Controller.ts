import 'koa-body';
import Koa, { Context } from 'koa';
import ChumiRouter from './ChumiRouter';
import {
  SymbolGet,
  SymbolPost,
  SymbolDelete,
  parameterMap,
  SymbolParameter,
  ALL,
  SymbolService,
  SymbolServiceName,
  SymbolControllerName,
  SymbolRouter,
  routeRule,
  SymbolApiTags,
  SymbolPut,
  ChumiControllerOptions,
  MethodAction,
  SymbolController,
  SymbolControllerInstance,
  SymbolControllerUniqueTag
} from './constants';
import Router from 'koa-router';

const handleParameter = (parameterMap: parameterMap[], ctx: Context) => {
  const parameters = Array.from(Array(parameterMap.length));
  parameterMap.forEach((item) => {
    const isAll = item.property === ALL;
    if (item.type === 'param') {
      parameters[item.parameterIndex] = isAll ? ctx.params : ctx.params[item.property as string];
    }
    if (item.type === 'query') {
      parameters[item.parameterIndex] = isAll ? ctx.query : ctx.query[item.property as string];
    }
    if (item.type === 'header') {
      parameters[item.parameterIndex] = isAll ? ctx.headers : ctx.headers[item.property as string];
    }
    if (item.type === 'body') {
      parameters[item.parameterIndex] = isAll
        ? ctx.request.body
        : ctx.request.body[item.property as string];
    }

    if (item.type === 'files') {
      parameters[item.parameterIndex] = isAll
        ? ctx.request.files
        : ctx.request.files[item.property as string];
    }

    switch (item.dataType) {
      case String:
        parameters[item.parameterIndex] = String(parameters[item.parameterIndex]);
        break;
      case Number:
        parameters[item.parameterIndex] = Number(parameters[item.parameterIndex]);
        break;
    }
  });
  return parameters;
};

export default (
  prefix?: string,
  routerOptions?: { middlewares: Koa.Middleware[] }
): ClassDecorator => {
  return (TargetControllerClass: any): any => {
    const uniqueTag = `##Controller_${Math.random()}##`;
    function Ctr<T>(
      router: InstanceType<typeof ChumiRouter>,
      createPrefixRouter: (prefix: string) => InstanceType<typeof ChumiRouter>,
      storeRouteRule: (rule: routeRule) => void,
      options: ChumiControllerOptions<T>
    ) {
      // 解决传入的不是当前chumi实例化的问题
      // 即：使用chumi定义的控制器实例，必须通过chumi进行实例化才生效，否则将不做任何处理
      if (
        router?.[SymbolRouter] !== SymbolRouter ||
        typeof createPrefixRouter !== 'function' ||
        typeof storeRouteRule !== 'function'
      ) {
        return;
      }

      // 移除多余斜杠
      let routePrefix = ((options.prefix ?? '') + (prefix ?? ''))
        .split('/')
        .filter((item) => item !== '')
        .join('/');

      /**
       * / 移除
       * /a => /a
       */
      if (routePrefix) {
        // 如果当前存在前缀，则添加斜杠，否则不添加
        routePrefix = '/' + routePrefix;
      }

      // 初始化当前控制器实例
      const targetControllerInstance = new TargetControllerClass();

      // 获取当前控制器实例的函数属性
      const allProperties = Object.getOwnPropertyNames(
        Object.getPrototypeOf(targetControllerInstance)
      );
      const currentRouter = routePrefix ? createPrefixRouter(routePrefix) : router;

      options.controllerMiddlewares?.forEach((middleware) => {
        currentRouter.use(middleware as Koa.Middleware);
      });

      routerOptions?.middlewares?.forEach((middleware) => {
        currentRouter.use(middleware);
      });

      /**
       * routeMethod: 请求类型
       * routePath: 请求路由
       */
      const routerMethodMap = {
        [SymbolGet]: {
          method: 'GET',
          routeAction: currentRouter.get.bind(currentRouter)
        },
        [SymbolPost]: {
          method: 'POST',
          routeAction: currentRouter.post.bind(currentRouter)
        },
        [SymbolDelete]: {
          method: 'Delete',
          routeAction: currentRouter.delete.bind(currentRouter)
        },
        [SymbolPut]: {
          method: 'Put',
          routeAction: currentRouter.put.bind(currentRouter)
        }
      };

      allProperties.forEach((actionName) => {
        if (actionName !== 'constructor') {
          const action: MethodAction = targetControllerInstance[actionName];

          action.routeInfo?.forEach((routeInfo) => {
            const routerMethodInfo: {
              method: string;
              routeAction: Router<Koa.Context, any>['all'];
            } = routerMethodMap[routeInfo.routeMethod];

            const { method, routeAction } = routerMethodInfo;

            /**
             * 处理配置，交给swagger
             */

            let parameterMap: parameterMap[] = null;
            if (
              targetControllerInstance[SymbolParameter] &&
              targetControllerInstance[SymbolParameter][actionName]
            ) {
              parameterMap = targetControllerInstance[SymbolParameter][actionName];
            }

            let routePath = routeInfo.routePath;
            let swaggerPath = routePrefix;

            // 针对路由定义，需要处理正则情况
            if (routeInfo.routePath instanceof RegExp) {
              swaggerPath = swaggerPath + routeInfo.routePath.toString();
            } else {
              if (typeof routeInfo.routePath === 'string') {
                routePath = routeInfo.routePath
                  .split('/')
                  .filter((item) => item !== '')
                  .join('/');
                if (/^\//.test(routeInfo.routePath)) {
                  // 以斜杠开头，都要加上斜杠
                  routePath = '/' + routePath;
                }
                swaggerPath = routePrefix + routePath;
              } else {
                throw new Error(`${routeInfo.routePath} is an invalid routing address definition`);
              }
            }

            storeRouteRule({
              method,
              path: swaggerPath,
              parameterMap,
              routeOptions: routeInfo.routeOptions,
              tags: Ctr[SymbolApiTags] ?? []
            });

            routeAction(
              routePath,
              /**
               * 处理路由中间件业务
               */
              ...(routeInfo.routeOptions?.middleware || []),
              async (ctx: Context) => {
                let parameters = [];
                /**
                 * 处理参数
                 */
                if (parameterMap) {
                  parameters = handleParameter(parameterMap, ctx);
                }

                ctx.chumi = options.data;
                const that = Object.assign(targetControllerInstance, { ctx });

                // 当前函数内，多次调用同一个实例，不需要重复实例化
                const cacheInstances = {};

                // proxy代理实现，所有实例，梦开始的地方
                const handler = {
                  get: function (_target, property) {
                    const uniqueProperty =
                      typeof property === 'string' ? `${uniqueTag}_${property}` : '';

                    // 这里的缓存，是调用开始的地方，这里不能移除，其他地方的实例化就不需要缓存了
                    if (cacheInstances[uniqueProperty]) {
                      return cacheInstances[uniqueProperty];
                    }

                    // 当发现需要调用到service实例时，从缓存中取出实例
                    if (that[property]?.[SymbolServiceName] === SymbolService) {
                      // 每次都需要实例化，动态注入当前的ctx
                      const instance = new that[property](ctx, options, cacheInstances);
                      cacheInstances[uniqueProperty] = instance;
                      // console.log('instance test>>>>', property);
                      return cacheInstances[uniqueProperty];
                    }

                    if (that[property]?.[SymbolControllerName] === SymbolController) {
                      // 控制器A 调用控制器B，直接单独初始化控制器B即可，当做一个纯的class
                      // 但是那个的ctx，就要继承当前传的ctx了，这里相当于把那个控制器当做一个延伸
                      const instance = new that[property][SymbolControllerInstance](
                        ctx,
                        options,
                        cacheInstances
                      );
                      cacheInstances[uniqueProperty] = instance;
                      // console.log('instance test>>>>', property);
                      return cacheInstances[uniqueProperty];
                    }

                    return that[property];
                  }
                };

                const result = await action.apply(new Proxy(that, handler), parameters);
                if (!ctx.body) {
                  ctx.body = result ?? '';
                }
              }
            );
          });
        }
      });
    }
    Ctr[SymbolControllerName] = SymbolController;
    Ctr[SymbolControllerInstance] = function <T>(
      ctx: Context,
      options: ChumiControllerOptions<T>,
      cacheInstances: {}
    ) {
      // 初始化当前控制器实例
      const targetControllerInstance = new TargetControllerClass();

      // 获取当前控制器实例的函数属性
      const allProperties = Object.getOwnPropertyNames(
        Object.getPrototypeOf(targetControllerInstance)
      );

      // 递归执行每个中间件，以达到符合中间件运行的功能逻辑
      const totalMiddlewares: Koa.Middleware[] = [];
      options.controllerMiddlewares?.forEach((middleware) => {
        totalMiddlewares.push(middleware as Koa.Middleware);
      });

      routerOptions?.middlewares?.forEach((middleware) => {
        totalMiddlewares.push(middleware);
      });

      const ml = totalMiddlewares.length;
      const loopMiddlewares = (i: number, actionFun: () => Promise<void>) => {
        if (i < ml) {
          const middleware = totalMiddlewares[i];
          return async () => {
            return await middleware(ctx, loopMiddlewares(i + 1, actionFun));
          };
        } else {
          // 最后加载核心中间件业务
          return actionFun;
        }
      };

      // 基础链式调用，未执行到具体函数，要支持继续链下去
      for (const property in targetControllerInstance) {
        if (targetControllerInstance[property]?.[SymbolServiceName] === SymbolService) {
          // 支持service链式传递，这里需要异步调用，不是立即获取到的
          Object.defineProperty(this, property, {
            get() {
              return targetControllerInstance[property];
            }
          });
        }
        if (targetControllerInstance[property]?.[SymbolControllerName] === SymbolController) {
          // 支持service 里面的controller链式传递，这里需要异步调用，不是立即获取到的
          Object.defineProperty(this, property, {
            get() {
              return targetControllerInstance[property];
            }
          });
        }
      }

      targetControllerInstance.ctx = ctx;

      const that = new Proxy(targetControllerInstance, {
        get: function (_target, property) {
          const uniqueProperty = typeof property === 'string' ? `${uniqueTag}_${property}` : '';

          if (cacheInstances[uniqueProperty]) {
            return cacheInstances[uniqueProperty];
          }
          if (
            typeof targetControllerInstance[property] === 'function' &&
            targetControllerInstance[property][SymbolServiceName] === SymbolService
          ) {
            // console.log('instance test>>>>', property);
            cacheInstances[uniqueProperty] = new targetControllerInstance[property](
              ctx,
              options,
              cacheInstances
            );
            return cacheInstances[uniqueProperty];
          }

          if (
            typeof targetControllerInstance[property] === 'function' &&
            targetControllerInstance[property][SymbolControllerName] === SymbolController
          ) {
            // console.log('instance test>>>>', property);
            cacheInstances[uniqueProperty] = new targetControllerInstance[property][
              SymbolControllerInstance
            ](ctx, options, cacheInstances);
            return cacheInstances[uniqueProperty];
          }
          return targetControllerInstance[property];
        }
      });

      allProperties.forEach((actionName) => {
        if (actionName !== 'constructor') {
          ctx.chumi = options.data;
          const action: MethodAction = targetControllerInstance[actionName];

          this[actionName] = async function (...args: any[]) {
            // 当前函数内，多次调用同一个实例，不需要重复实例化
            // const cacheInstances = {};
            return await new Promise<void>(async (resolve, reject) => {
              try {
                await loopMiddlewares(0, async () => {
                  resolve(await action.apply(that, args));
                })();
                resolve();
              } catch (error) {
                reject(error);
              }
            });
          };
        }
      });

      return that;
    };
    Ctr[SymbolControllerUniqueTag] = uniqueTag;

    return Ctr;
  };
};
