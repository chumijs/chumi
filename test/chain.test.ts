import { Server } from 'http';
import supertest from 'supertest';
import app from './fixtures/chain';

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
    const data = await Promise.all(
      Array.from(Array(100)).map((item, index) => {
        return request.get(`/${index}`).then((res) => {
          return res.text === '/' + index;
        });
      })
    );
    expect(data.filter((item) => !item).length).toBe(0);
  });
});
