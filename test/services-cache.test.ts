import { Server } from 'http';
import supertest from 'supertest';
import app from './fixtures/services-cache';

describe('Chain Services Cache test', () => {
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
    const [res1, res2] = await Promise.all([
      request.get('/1').then((res) => res.body),
      request.get('/2').then((res) => res.body)
    ]);
    await request.get('/100').expect(200);
    expect(res2.a1.a1).toBe(res1.a1.a1);
    expect(res1.a1.a2).toBe(res1.a2.a2);
    expect(res1.a1.a1).toBe(res1.a3.a3);
    expect(res1.a1.a3).toBe('a');
  });
});
