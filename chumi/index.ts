/**
 * chumi运行时框架核心代码
 */
import { Context, Next } from 'koa';
import koaBody from 'koa-body';

import ChumiRouter from './ChumiRouter';
import { Ctr, SwaggerOptions } from './constants';
import Swagger from './Swagger';

export { ALL, loadService, loadController } from './constants';
export * from './Methods';
export * from './Parameters';

export { default as Controller } from './Controller';
export { default as Service } from './Service';
export { default as ApiTags } from './ApiTags';

export interface ChumiOptions<T> {
  /**
   * 如果项目之前已经使用了koa-body，或者类似的处理函数，这个参数就不需要传了
   */
  koaBody?: koaBody.IKoaBodyOptions;
  /**
   * 当chumi中间件开始时触发
   */
  onStart?: (ctx: T) => Promise<void> | void;
  /**
   * 当chumi中间件业务发生错误时触发
   */
  onError?: (ctx: T, error: Error) => Promise<void> | void;
  /**
   * 当chumi中间件业务成功时触发
   */
  onSuccess?: (ctx: T) => Promise<void> | void;
  /**
   * 当chumi中间件业务完成时触发
   */
  onFinish?: (ctx: T) => Promise<void> | void;
  /**
   * 开启swagger
   *
   * 默认访问 /swagger-ui/index.html
   */
  swagger?: SwaggerOptions;
  /**
   * 当前chumi下所有路由地址的统一前缀
   */
  prefix?: string;
  /**
   * 支持传数据到控制器里面
   *
   * 在控制器可以使用，ctx.chumi 获取到当前传的数据
   */
  data?: Record<string | number, any>;
  /**
   * 是否跳过chumi路由和控制器，即不执行chumi任何路由挂载逻辑
   *
   * 1. 返回`true`表示跳过
   * 2. 返回`false`表示不跳过
   */
  skip?: (ctx: T) => Promise<boolean> | boolean;
  /**
   * koa中间件数组，承担当前chumi路由的前置处理
   */
  middlewares?: ((ctx: T, next: Next) => Promise<void>)[];
  /**
   * 匹配到控制器路由，生效的中间件
   */
  controllerMiddlewares?: ((ctx: T, next: Next) => Promise<void>)[];
}

type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (
  ...args: any
) => Promise<infer R>
  ? R
  : T;

export type ChumiResponseData<
  S extends abstract new (...args: any) => any,
  T extends keyof InstanceType<S>
> = AsyncReturnType<InstanceType<S>[T]>;

/**
 * 基于koa的运行时中间件框架
 *
 * ```
 * 参数1: controllers: Ctr[] | Record<prefix, Ctr[]>
 *  如果指定了prefix，则最终的prefix = 参数2的prefix + 参数1的prefix
 * 参数2: {}
 *  koaBody: 指定启动body解析，如果框架内已内置，则不需要配置
 *  onStart: 当chumi中间件开始时触发
 *  onError: 仅当chumi中间件业务发生错误时触发
 *  onSuccess: 仅当chumi中间件业务成功时触发
 *  onFinish: 当chumi中间件业务完成时触发，不管失败、成功都会触发
 *  swagger: 开启swagger
 *  prefix: 当前chumi下所有路由地址的统一前缀
 *  middlewares: 指定koa中间件数组
 *  controllerMiddlewares: 指定koa中间件数组，仅当路由匹配到时触发，属于挂载在控制器上的中间件
 *  data
 *  skip
 * ```
 */
export const chumi = <T>(controllers: Ctr<T>, options?: ChumiOptions<T & Context>) => {
  const chumiRouter = new ChumiRouter<T>(controllers, {
    prefix: options?.prefix,
    data: options?.data,
    controllerMiddlewares: options?.controllerMiddlewares
  });
  const swaggerInstance = options?.swagger
    ? new Swagger(
        {
          ...(options.prefix ? { swaggerPath: options.prefix + '/swagger-ui' } : {}),
          ...options.swagger
        },
        chumiRouter
      )
    : null;

  const ml = options?.middlewares?.length ?? 0;

  return async (ctx: T & Context, next: Next) => {
    try {
      // chumi入口
      await options?.onStart?.(ctx);

      // 递归执行每个中间件，以达到符合中间件运行的功能逻辑
      const loopMiddlewares = (i: number) => {
        if (i < ml) {
          const middleware = options.middlewares[i];
          return async () => await middleware(ctx, loopMiddlewares(i + 1));
        } else {
          // 最后加载核心中间件业务
          return async () => {
            // 判断是否跳过chumi业务
            const skip = (await options?.skip?.(ctx)) ?? false;
            if (!skip) {
              // 不跳过，需要走chumi业务逻辑
              let hitSwagger = false;
              if (swaggerInstance) {
                // 开启swagger
                if (await swaggerInstance.run(ctx, next)) {
                  // 匹配到swagger地址，则不继续执行，直接返回
                  hitSwagger = true;
                  return;
                }
              }
              // 没有命中swagger，则继续执行当前的chumi核心业务
              if (!hitSwagger) {
                await new Promise<void>((resolve) => {
                  if (options?.koaBody) {
                    koaBody(options.koaBody)(ctx, async () => resolve());
                  } else {
                    resolve();
                  }
                });
                await chumiRouter.mount(ctx, next);
              }
            } else {
              // 直接跳过
              await next();
            }
          };
        }
      };

      // 启动中间件
      await loopMiddlewares(0)();

      // chumi执行成功
      await options?.onSuccess?.(ctx);
    } catch (error) {
      // chumi执行失败
      ctx.status = 500;
      if (options?.onError) {
        options.onError(ctx, error);
      } else {
        throw error;
      }
    } finally {
      // chumi完成本次请求
      await options?.onFinish?.(ctx);
    }
  };
};

export default chumi;
