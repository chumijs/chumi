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

/**
 * 基于koa的运行时中间件框架
 */
export const chumi = (
  controllers: Object[],
  options?: {
    /**
     * 如果项目之前已经使用了koa-body，或者类似的处理函数，这个参数就不需要传了
     */
    koaBody?: koaBody.IKoaBodyOptions;
    /**
     * 当chumi中间件开始时触发
     */
    onStart?: (ctx: Context) => Promise<void> | void;
    /**
     * 当chumi中间件业务发生错误时触发
     */
    onError?: (ctx: Context, error: Error) => Promise<void> | void;
    /**
     * 当chumi中间件业务成功时触发
     */
    onSuccess?: (ctx: Context) => Promise<void> | void;
    /**
     * 当chumi中间件业务完成时触发
     */
    onFinish?: (ctx: Context) => Promise<void> | void;
    /**
     * 开启swagger
     *
     * 默认访问 /swagger-ui/index.html
     */
    swagger?: SwaggerOptions;
  }
) => {
  const chumiRouter = new ChumiRouter(controllers);
  const swaggerInstance = new Swagger(options?.swagger, chumiRouter);
  return async (ctx: Context, next: Next) => {
    if (options?.swagger) {
      // 开启swagger
      // eslint-disable-next-line no-new
      if (await swaggerInstance.run(ctx)) {
        return next();
      }
    }

    try {
      await options?.onStart?.(ctx);
      await new Promise<void>((resolve) => {
        if (options?.koaBody) {
          koaBody(options.koaBody)(ctx, async () => resolve());
        } else {
          resolve();
        }
      });
      await chumiRouter.mount(ctx, next);
      await options?.onSuccess?.(ctx);
    } catch (error) {
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
