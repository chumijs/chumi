/**
 * 接口并发测试
 */
import Koa, { Context } from 'koa';
import supertest from 'supertest';
import chumi, { Controller, Param, Post, Service, loadController, loadService } from '../chumi';

describe('concurrence test', () => {
  const serverInstance = [];

  afterAll(() => {
    serverInstance.forEach((server) => server.close());
  });

  test('test concurrence 100', async () => {
    const app = new Koa();

    @Controller()
    class Ctr1 {
      ctx: Context;
      async ctr1() {
        return Number(this.ctx.params.id);
      }
    }

    @Service
    class S1 {
      ctx: Context;
      ctr1 = loadController(Ctr1);
      async s1() {
        return this.ctr1.ctr1();
      }
    }

    @Controller('/', {
      middlewares: [
        async (ctx, next) => {
          ctx.tempV = Number(ctx.query.id);
          await next();
        }
      ]
    })
    class Sample {
      ctx: Context;
      s1 = loadService(S1);
      @Post('/:id')
      async index(@Param('id') id: string) {
        return { id: Number(id), count: this.ctx.tempV, s1: await this.s1.s1() };
      }
    }
    app.use(chumi([Sample]));

    const server = app.listen();
    const request = supertest(server);

    serverInstance.push(server);

    const data = await Promise.all(
      Array.from(Array(100)).map((item, index) => {
        return request.post(`/${index}?id=${index}`).then((res) => {
          return res.body.id === index && res.body.count === index && res.body.s1 === index;
        });
      })
    );
    expect(data.filter((item) => !item).length).toBe(0);
  });
});
