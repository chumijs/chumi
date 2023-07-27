import { Server } from 'http';
import supertest from 'supertest';
import app from './fixtures/chain-cache';

describe('Chain test', () => {
  let server: Server;
  let request: supertest.SuperTest<supertest.Test>;
  beforeAll(() => {
    server = app.listen();
    request = supertest(server);
  });

  afterAll(() => {
    server.close();
    server = null;
    request = null;
  });

  test('test', async () => {
    // 测试正常 控制器调用控制器
    const res1 = await request.get(`/10`).then((res) => {
      return res.body;
    });
    const res2 = await request.get(`/10/test`).then((res) => {
      return res.body;
    });
    expect(res1.a1).toBe(res1.a2);
    expect(res1.a1).toBe(res1.a3);
    expect(res1.a1).toBe('/10');

    expect(res2.a1.a1).toBe(res2.a2.a1);
    expect(res2.a1.a3).toBe('/10/test');
  });
});
