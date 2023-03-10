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
    server = null;
    request = null;
  });

  test('test', () => {
    return request.get('/').expect(200);
  });
});
