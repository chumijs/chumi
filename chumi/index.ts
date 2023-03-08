/**
 * chumi运行时框架核心代码
 */
import { Context, Next } from 'koa';
import koaBody from 'koa-body';
import ChumiRouter from './ChumiRouter';

export { ALL, loadService } from './constants';
export * from './Methods';
export * from './Parameters';

export { default as Controller } from './Controller';
export { default as Service } from './Service';

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
  }
) => {
  const chumi = new ChumiRouter(controllers).export;
  return async (ctx: Context, next: Next) => {
    try {
      await options?.onStart?.(ctx);
      await new Promise<void>((resolve) => {
        if (options?.koaBody) {
          koaBody(options.koaBody)(ctx, async () => resolve());
        } else {
          resolve();
        }
      });
      await chumi(ctx, next);
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
