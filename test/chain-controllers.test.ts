import { Server } from 'http';
import supertest from 'supertest';
import app from './fixtures/chain-controllers';

describe('Chain Services test', () => {
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
    const res1 = await request.get('/ctr2/to1?name=A').then((res) => res.body);
    expect(res1.name).toBe('A_/ctr2/to1_2_A');
  });
});
