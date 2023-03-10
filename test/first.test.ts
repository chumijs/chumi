import { Server } from 'http';
import supertest from 'supertest';
import app from './fixtures/small';

describe('Simple test', () => {
  let server: Server;
  let request: supertest.SuperTest<supertest.Test>;
  beforeAll(() => {
    server = app.listen();
    request = supertest(server);
  });

  afterAll(() => {
    server.close();
  });

  test('abc', () => {
    request.get('/').expect(200);
    // expect(1 + 2).toBe(3);
  });
});
