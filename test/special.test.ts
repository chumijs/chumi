import { Server } from 'http';
import supertest from 'supertest';
import Koa from 'koa';
import chumi from '../chumi';

describe('Special test', () => {
  let server: Server;
  let request: supertest.SuperTest<supertest.Test>;
  beforeAll(() => {
    const app = new Koa();
    app.use(chumi([]));
    server = app.listen();
    request = supertest(server);
  });

  afterAll(() => {
    server.close();
    server = null;
    request = null;
  });

  test('test-404', () => {
    return request.get('/404').expect(404);
  });
});
