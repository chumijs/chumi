/**
 * chumi运行时框架核心代码
 */
import { Context, Next } from 'koa';
import koaBody from 'koa-body';

import ChumiRouter from './ChumiRouter';
import { SwaggerOptions } from './constants';
import Swagger from './Swagger';

export { ALL, loadService } from './constants';
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
}

/**
 * 基于koa的运行时中间件框架
 */
export const chumi = <T>(controllers: Object[], options?: ChumiOptions<T & Context>) => {
  const chumiRouter = new ChumiRouter(controllers, {
    prefix: options?.prefix,
    data: options?.data
  });
  const swaggerInstance = new Swagger(
    {
      ...(options?.prefix ? { swaggerPath: options.prefix + '/swagger-ui' } : {}),
      ...(options?.swagger ?? {})
    },
    chumiRouter
  );
  return async (ctx: T & Context, next: Next) => {
    if (options?.swagger) {
      // 开启swagger
      // eslint-disable-next-line no-new
      if (await swaggerInstance.run(ctx)) {
        return next();
      }
    }

    try {
      await options?.onStart?.(ctx);
      const skip = options?.skip?.(ctx) ?? false;
      if (!skip) {
        // 不跳过，需要走chumi业务逻辑
        await new Promise<void>((resolve) => {
          if (options?.koaBody) {
            koaBody(options.koaBody)(ctx, async () => resolve());
          } else {
            resolve();
          }
        });
        await chumiRouter.mount(ctx, next);
      } else {
        // 直接跳过
        await next();
      }
      await options?.onSuccess?.(ctx);
    } catch (error) {
      ctx.status = 500;
      if (options?.onError) {
        options.onError(ctx, error);
      } else {
        throw error;
      }
    } finally {
      await options?.onFinish?.(ctx);
    }
  };
};

export default chumi;
