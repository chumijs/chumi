/**
 * 测试chumi option功能
 * 1. prefix
 * 2. data
 */
import supertest from 'supertest';
import Koa, { Context } from 'koa';
import chumi, { Controller, Get } from '../chumi';

@Controller()
class Sample1 {
  ctx: Context;
  @Get('/test1/:id')
  async getError() {
    return this.ctx.path;
  }
}

@Controller()
class Sample2 {
  ctx: Context;
  @Get('/test2/:id')
  async getError() {
    return this.ctx.path;
  }
}

@Controller()
class Sample3 {
  ctx: Context;
  @Get('/test3/:id')
  async getError() {
    return this.ctx.chumi;
  }
}

describe('Chumi Options', () => {
  test('test prefix', async () => {
    const app1 = new Koa();
    const app2 = new Koa();
    app1.use(chumi([Sample1, Sample2], { prefix: '/api1' }));
    app2.use(chumi([Sample1, Sample2], { prefix: '/api2' }));
    const server1 = app1.listen();
    const server2 = app2.listen();
    const request1 = supertest(server1);
    const request2 = supertest(server2);

    const res1 = await request1.get('/api1/test1/1').then((res) => res.text);
    const res2 = await request1.get('/api1/test2/1').then((res) => res.text);
    const res3 = await request2.get('/api2/test1/1').then((res) => res.text);
    const res4 = await request2.get('/api2/test2/1').then((res) => res.text);

    expect(res1).toBe('/api1/test1/1');
    expect(res2).toBe('/api1/test2/1');
    expect(res3).toBe('/api2/test1/1');
    expect(res4).toBe('/api2/test2/1');

    server1.close();
    server2.close();
  });

  test('test prefix swagger', (done) => {
    const app = new Koa();
    app.use(chumi([Sample3], { prefix: '/api', swagger: {} }));
    const server = app.listen();
    const request = supertest(server);

    request
      .get('/api/swagger-ui/index.html')
      .expect(200)
      .end((err, res) => {
        server.close();
        if (err) {
          return done(err);
        }
        expect(res.text).toMatch('swagger-ui-bundle.js');
        return done();
      });
  });

  test('test prefix swagger more instance', async () => {
    const app1 = new Koa();
    const app2 = new Koa();
    app1.use(chumi([Sample1, Sample2], { prefix: '/api1', swagger: {} }));
    app2.use(chumi([Sample1, Sample2], { prefix: '/api2', swagger: {} }));
    const server1 = app1.listen();
    const server2 = app2.listen();
    const request1 = supertest(server1);
    const request2 = supertest(server2);

    const res1 = await request1.get('/api1/swagger-ui/index.html').then((res) => res.text);
    const res2 = await request2.get('/api2/swagger-ui/index.html').then((res) => res.text);

    expect(res1).toMatch('swagger-ui-bundle.js');
    expect(res2).toMatch('swagger-ui-bundle.js');

    server1.close();
    server2.close();
  });

  test('test data', async () => {
    const app = new Koa();
    app.use(chumi([Sample3], { prefix: '/api', data: { a: 2 } }));
    const server = app.listen();
    const request = supertest(server);

    const res = await request.get('/api/test3/1').then((res) => res.body);
    expect(res.a).toBe(2);

    server.close();
  });

  test('test data more instance', async () => {
    const app = new Koa();
    app.use(chumi([Sample3], { prefix: '/api1', data: { a: 2 } }));
    app.use(chumi([Sample3], { prefix: '/api2', data: { a: 3 } }));
    const server = app.listen();
    const request = supertest(server);

    const res1 = await request.get('/api1/test3/1').then((res) => res.body);
    const res2 = await request.get('/api2/test3/2').then((res) => res.body);

    expect(res1.a).toBe(2);
    expect(res2.a).toBe(3);

    server.close();
  });

  test('test no data', async () => {
    const app = new Koa();
    app.use(chumi([Sample3], { prefix: '/api' }));
    const server = app.listen();
    const request = supertest(server);

    const res = await request.get('/api/test3/1').then((res) => res.body);
    expect(res.a).toBe(undefined);

    server.close();
  });
});
