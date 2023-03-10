import { Server } from 'http';
import supertest from 'supertest';
import app from './fixtures/normal';

describe('Normal test', () => {
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

  test('test-post', async () => {
    const name = Math.random();
    return request
      .post('/api/user')
      .send({ name })
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        expect(response.body.name).toBe(name);
      });
  });

  test('test-delete', async () => {
    return request
      .delete('/api/user/100')
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        expect(response.body.id).toBe(100);
      });
  });

  test('test-put', async () => {
    const name = Math.random();
    return request
      .put('/api/user?name=' + name)
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        expect(response.body.name).toBe(String(name));
      });
  });

  test('test-service', (done) => {
    request
      .get('/api/path')
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.text).toBe('/api/path');
        return done();
      });
  });
});
