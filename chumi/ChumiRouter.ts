import Router from 'koa-router';
import Koa from 'koa';
import compose from 'koa-compose';
import { ChumiControllerOptions, Ctr, routeRule, routeRules, SymbolRouter } from './constants';

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

  private routeRules: routeRules = [];

  public constructor(controllers: Ctr, options?: ChumiControllerOptions) {
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

    if (Array.isArray(controllers)) {
      controllers.forEach((Controller: any) => {
        // 注入chumi路由标识
        router[SymbolRouter] = SymbolRouter;
        // eslint-disable-next-line no-new
        new Controller(router, this.prefix.bind(this), this.storeRouteRule.bind(this), options);
      });
    } else {
      for (const prefix in controllers) {
        controllers[prefix].forEach((Controller: any) => {
          // 注入chumi路由标识
          router[SymbolRouter] = SymbolRouter;
          // eslint-disable-next-line no-new
          new Controller(router, this.prefix.bind(this), this.storeRouteRule.bind(this), {
            ...options,
            prefix: (options.prefix ?? '') + prefix
          });
        });
      }
    }
  }

  private storeRouteRule(routeRule: routeRule) {
    this.routeRules.push(routeRule);
  }

  public getRouteRules() {
    return [...this.routeRules];
  }

  public get mount() {
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
