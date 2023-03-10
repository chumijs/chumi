/**
 * 测试上下文一致
 */
import supertest from 'supertest';
import Koa, { Context } from 'koa';
import chumi, { Controller, Get, loadService, Service } from '../chumi';

@Controller()
class Sample {
  service = loadService(Service1);
  ctx: Context;
  @Get('/test/:id')
  async getError() {
    const paths = await this.service.action();
    return {
      path: this.ctx.path,
      ...paths
    };
  }
}

@Service
class Service1 {
  ctx: Context;
  service2 = loadService(Service2);

  async action() {
    const path1 = await this.service2.action();
    const path2 = this.ctx.path;
    return { path1, path2 };
  }
}

@Service
class Service2 {
  ctx: Context;

  async action() {
    return this.ctx.path;
  }
}

describe('Context Concurrence', () => {
  test('ctr->service->service', async () => {
    const app = new Koa();
    app.use(chumi([Sample]));
    const server = app.listen();
    const request = supertest(server);
    const result = await Promise.all(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => {
        return new Promise<{ res: supertest.Response; id: number }>(async (resolve) => {
          const res = await request.get(`/test/${item}`).expect(200);
          resolve({ res, id: item });
        });
      })
    );
    result.forEach((item) => {
      const body = item.res.body;
      expect(`${body.path}${body.path1}${body.path2}`).toBe(
        `/test/${item.id}/test/${item.id}/test/${item.id}`
      );
    });
    server.close();
  });
});
