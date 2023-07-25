import { Server } from 'http';
import supertest from 'supertest';
import app from './fixtures/chain-controllers-boundary';

describe('Chain Controllers Boundary  test', () => {
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

  // 测试 控制器 调用 控制器
  // ctr2 -> ctr1
  // ctr3 -> ctr2
  test('ctr2 -> ctr1、ctr3 -> ctr2', async () => {
    // 测试正常 控制器调用控制器
    const res1 = await request.get('/ctr2/to2?name=A').then((res) => res.body);
    expect(res1.name).toBe('A_2');
  });
});
