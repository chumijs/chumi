/**
 * 测试chumi swagger功能
 * 1. 多个chumi实例，合并swagger接口页面的功能
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

describe('Chumi Swagger', () => {
  test('test more chumi swagger same path', async () => {
    const app = new Koa();
    app.use(chumi([Sample1], { prefix: '/api', swagger: {} }));
    app.use(chumi([Sample2], { prefix: '/api', swagger: {} }));
    const server = app.listen();
    const request = supertest(server);

    const res = await request.get('/api/swagger-ui/index.json').then((res) => res.text);

    expect(res).toBe(
      JSON.stringify({
        openapi: '3.0.1',
        info: {
          title: 'My Project',
          description: 'This is a swagger-ui for chumi',
          version: '1.0.0',
          contact: {}
        },
        tags: [],
        paths: {
          '/api/test1/{id}': {
            get: {
              parameters: [],
              tags: [],
              responses: {
                '200': {
                  description: 'OK'
                }
              }
            }
          },
          '/api/test2/{id}': {
            get: {
              parameters: [],
              tags: [],
              responses: {
                '200': {
                  description: 'OK'
                }
              }
            }
          }
        }
      })
    );

    server.close();
  });

  test('test more chumi swagger no same path1', async () => {
    const app = new Koa();
    app.use(chumi([Sample1], { prefix: '/api1', swagger: {} }));
    app.use(chumi([Sample2], { prefix: '/api2', swagger: {} }));
    const server = app.listen();
    const request = supertest(server);

    const res = await request.get('/api1/swagger-ui/index.json').then((res) => res.text);

    expect(res).toBe(
      JSON.stringify({
        openapi: '3.0.1',
        info: {
          title: 'My Project',
          description: 'This is a swagger-ui for chumi',
          version: '1.0.0',
          contact: {}
        },
        tags: [],
        paths: {
          '/api1/test1/{id}': {
            get: {
              parameters: [],
              tags: [],
              responses: {
                '200': {
                  description: 'OK'
                }
              }
            }
          }
        }
      })
    );

    server.close();
  });

  test('test more chumi swagger no same path2', async () => {
    const app = new Koa();
    app.use(chumi([Sample1], { prefix: '/api1', swagger: {} }));
    app.use(chumi([Sample2], { prefix: '/api2', swagger: {} }));
    const server = app.listen();
    const request = supertest(server);

    const res = await request.get('/api2/swagger-ui/index.json').then((res) => res.text);

    expect(res).toBe(
      JSON.stringify({
        openapi: '3.0.1',
        info: {
          title: 'My Project',
          description: 'This is a swagger-ui for chumi',
          version: '1.0.0',
          contact: {}
        },
        tags: [],
        paths: {
          '/api2/test2/{id}': {
            get: {
              parameters: [],
              tags: [],
              responses: {
                '200': {
                  description: 'OK'
                }
              }
            }
          }
        }
      })
    );

    server.close();
  });

  test('test chumi swagger error response', async () => {
    const app = new Koa();
    app.use(chumi([Sample1], { swagger: {} }));
    app.use(async (ctx, next) => {
      try {
        await next();
      } catch (error) {
        ctx.status = 500;
        ctx.body = error.message;
      }
    });
    app.use(async () => {
      throw new Error('error');
    });
    const server = app.listen();
    const request = supertest(server);

    const res = await request
      .get('/swagger-ui/index.json')
      .expect(200)
      .then((res) => res.text);

    expect(res).toBe(
      JSON.stringify({
        openapi: '3.0.1',
        info: {
          title: 'My Project',
          description: 'This is a swagger-ui for chumi',
          version: '1.0.0',
          contact: {}
        },
        tags: [],
        paths: {
          '/test1/{id}': {
            get: {
              parameters: [],
              tags: [],
              responses: {
                '200': {
                  description: 'OK'
                }
              }
            }
          }
        }
      })
    );

    server.close();
  });
});
