import { Server } from 'http';
import supertest from 'supertest';
import app from './fixtures/chain-controllers';

describe('Chain Controllers test', () => {
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
    expect(res1.name).toBe('A_/ctr2/to2_2_A$$123_123');

    // 测试被中间件异常捕获 控制器调用控制器
    const res2 = await request.get('/ctr2/to2-error?name=A').then((res) => res.body);
    expect(res2.name).toBe('A');

    // 测试被系统异常捕获 控制器调用控制器
    const res3 = await request.get('/ctr3/to3-error?name=A').then((res) => res.text);
    expect(res3).toBe('Internal Server Error');
  });

  // 测试 控制器 调用 控制器 调用控制器
  // ctr3 -> ctr2 -> ctr1
  test('ctr3 -> ctr2 -> ctr1', async () => {
    const res4 = await request.get('/ctr3/to3?name=A').then((res) => res.body);
    expect(res4.name).toBe('A_/ctr3/to3_2_A$$123_123controllerMiddlewares');
  });

  test('ctr3 more', async () => {
    const res1 = await request.get('/ctr3/to3-more?name=A').then((res) => res.body);
    expect(res1.name).toBe('A_/ctr3/to3-more_2_A$$123_123controllerMiddlewares');
  });

  test.only('ctr3 -> ctr2 -> s1 -> ctr1', async () => {
    const res1 = await request.get('/ctr3/to3-ctr2-s1-ctr1?name=A').then((res) => res.body);
    expect(res1.s1.name).toBe(res1.s2.name);
    expect(res1.s1.key).toBe(res1.s3.key);
    expect(res1.s1.name).toBe('A_/ctr3/to3-ctr2-s1-ctr1_2_A$$123_123');
    expect(res1.s2.key).toBe('/ctr3/to3-ctr2-s1-ctr1_t3_A');
  });
});
