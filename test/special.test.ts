import { Server } from 'http';
import supertest from 'supertest';
import Koa from 'koa';
import chumi, { Controller, Get } from '../chumi';

@Controller()
class Sample {
  say() {
    return 123;
  }

  @Get('/error')
  async getError() {
    throw new Error();
  }
}

describe('Special test', () => {
  let server: Server;
  let request: supertest.SuperTest<supertest.Test>;

  const hook = jest.fn();
  const error = jest.fn();

  beforeAll(() => {
    const app = new Koa();
    app.use(
      chumi([Sample], {
        onStart() {
          hook();
        },
        onError() {
          error();
        },
        onSuccess() {
          hook();
        },
        onFinish() {
          hook();
        }
      })
    );
    server = app.listen();
    request = supertest(server);
  });

  afterAll(() => {
    server.close();
    server = null;
    request = null;
  });

  test('direct new controller', () => {
    const sample = new Sample();
    expect(sample.say).toBe(undefined);
  });

  test('test-404', async () => {
    await request.get('/404').expect(404);
    expect(hook).toHaveBeenCalledTimes(3);
  });

  test('test-error', async () => {
    await request.get('/error').expect(500);
    expect(error).toHaveBeenCalledTimes(1);
  });

  test('test-no-error-hook', async () => {
    const app = new Koa();
    app.use(chumi([Sample]));
    const server = app.listen();
    const request = supertest(server);
    await request.get('/error').expect(500);
    server.close();
  });
});
