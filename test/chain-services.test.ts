import { Server } from 'http';
import supertest from 'supertest';
import app from './fixtures/chain-services';

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
    const res1 = await request.get('/?name=A&action=a').then((res) => res.text);
    expect(res1).toMatch('a');
    const res2 = await request.get('/?name=D&action=a').then((res) => res.text);
    expect(res2).toMatch('');
    const res3 = await request.get('/?name=A&action=b').then((res) => res.text);
    expect(res3).toMatch('');
  });
});
