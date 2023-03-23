/**
 * 路由地址支持正则 @Get(/^\/api\/user/)
 *
 * 路由支持中间件 @Get("/api",{ middleware: [] })
 *
 * 多个路由绑定到同一个方法上
 *
 * ```
 * @Get("/user")
 * @Get("/abc")
 * async index(){
 * return "123"
 * }
 * ```
 */
import supertest from 'supertest';
import Koa, { Context } from 'koa';
import chumi, { Controller, Get } from '../chumi';

describe('chumi-route-path', () => {
  const serverInstance = [];

  afterAll(() => {
    console.log('after');
    serverInstance.forEach((server) => server.close());
  });

  test('route path regexp', (done) => {
    const app = new Koa();
    @Controller()
    class Sample {
      @Get(/^\/test\//)
      test() {
        return 123;
      }
    }
    app.use(chumi([Sample]));
    const server = app.listen();

    const request = supertest(server);

    // 浏览器测试，注释这一行，把下一行的地址日志打开
    serverInstance.push(server);
    // console.log(server.address());

    (async () => {
      await request.get('/test1').expect(404);
      await request.get('/test/').expect(200);
      done();
    })();
  });

  test('route path middleware', (done) => {
    const app = new Koa();
    const fn = jest.fn();
    @Controller()
    class Sample {
      ctx: Context;

      @Get(/^\/test\//, {
        middleware: [
          async (ctx, next) => {
            fn();
            ctx.abc = 1;
            await next();
            fn();
          },
          async (ctx, next) => {
            ctx.abc = ctx.abc + 1;
            fn();
            await next();
            fn();
          }
        ]
      })
      test() {
        fn();
        return this.ctx.abc;
      }
    }
    app.use(chumi([Sample]));
    const server = app.listen();

    const request = supertest(server);

    // 浏览器测试，注释这一行，把下一行的地址日志打开
    serverInstance.push(server);
    // console.log(server.address());

    (async () => {
      const res = await request
        .get('/test/')
        .expect(200)
        .then((res) => res.text);
      expect(res).toBe('2');
      expect(fn).toHaveBeenCalledTimes(5);
      done();
    })();
  });

  test('more route', (done) => {
    const app = new Koa();
    const fn = jest.fn();
    @Controller()
    class Sample {
      ctx: Context;

      @Get('/api')
      @Get(/^\/test\//, {
        middleware: [
          async (ctx, next) => {
            fn();
            ctx.abc = 1;
            await next();
            fn();
          },
          async (ctx, next) => {
            ctx.abc = ctx.abc + 1;
            fn();
            await next();
            fn();
          }
        ]
      })
      test() {
        fn();
        return this.ctx.abc;
      }
    }
    app.use(chumi([Sample]));
    const server = app.listen();

    const request = supertest(server);

    // 浏览器测试，注释这一行，把下一行的地址日志打开
    serverInstance.push(server);
    // console.log(server.address());

    (async () => {
      const res = await request
        .get('/api/')
        .expect(200)
        .then((res) => res.text);
      expect(res).toBe('');
      expect(fn).toHaveBeenCalledTimes(1);
      await request.get('/test/').expect(200);
      expect(fn).toHaveBeenCalledTimes(6);
      done();
    })();
  });
});
