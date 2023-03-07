import Router from 'koa-router';
import Koa from 'koa';
import compose from 'koa-compose';
import { SymbolRouter } from './constants';

export default class ChumiRouter<T> {
  private routes: Router<Koa.Context, T>[] = [];

  public get: Router<Koa.Context, T>['get'];
  public post: Router<Koa.Context, T>['post'];
  public delete: Router<Koa.Context, T>['delete'];
  public put: Router<Koa.Context, T>['put'];
  public link: Router<Koa.Context, T>['link'];
  public unlink: Router<Koa.Context, T>['unlink'];
  public patch: Router<Koa.Context, T>['patch'];
  public all: Router<Koa.Context, T>['all'];
  public use: Router<Koa.Context, T>['use'];

  public constructor(controllers: Object[]) {
    const router = new Router<Koa.Context, T>();

    this.routes.push(router);

    this.get = router.get.bind(router);
    this.post = router.post.bind(router);
    this.delete = router.delete.bind(router);
    this.put = router.put.bind(router);
    this.link = router.link.bind(router);
    this.unlink = router.unlink.bind(router);
    this.patch = router.patch.bind(router);
    this.all = router.all.bind(router);
    this.use = router.use.bind(router);

    controllers.forEach((Controller: any) => {
      // 注入chumi路由标识
      router[SymbolRouter] = SymbolRouter;
      // eslint-disable-next-line no-new
      new Controller(router, this.prefix.bind(this));
    });

    /**
     * 没有匹配到，处理404请求
     */
    router.all('', async (ctx) => {
      ctx.status = 404;
    });
  }

  public get export() {
    const result: compose.Middleware<unknown>[] = [];
    this.routes.forEach((route) => {
      result.push(route.routes(), route.allowedMethods());
    });
    return compose(result);
  }

  public prefix(str: string) {
    const router = new Router<Koa.Context, T>({ prefix: str });
    this.routes.push(router);
    return router;
  }
}
