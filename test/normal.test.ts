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
      .send({ name, id: 100 })
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        expect(response.body.name).toBe(name);
        expect(response.body.id1).toBe(100);
        expect(response.body.id2).toBe('100');
        expect(response.body.all.id).toBe(100);
      });
  });

  test('test-delete', async () => {
    return request
      .delete('/api/user/100')
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        expect(response.body.id).toBe(100);
        expect(response.body.id2).toBe('100');
        expect(response.body.all.id).toBe('100');
      });
  });

  test('test-put', async () => {
    const name = Math.random();
    return request
      .put('/api/user?name=' + name + '&id=100')
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        expect(response.body.name).toBe(String(name));
        expect(response.body.id1).toBe('100');
        expect(response.body.id2).toBe(100);
        expect(response.body.all.id).toBe('100');
      });
  });

  test('test-header', (done) => {
    request
      .get('/api/headers')
      .set('abc', 'abc')
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.text).toBe('abc');
        return done();
      });
  });

  test('test-service', (done) => {
    request
      .get('/api/path')
      .set('abc', 'abc')
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.text).toBe('/api/path GETGET abc /api/path GETGET');
        return done();
      });
  });

  test('test-swagger-ui', (done) => {
    request
      .get('/swagger-ui/index.html')
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.text).toMatch('swagger-ui-bundle.js');
        return done();
      });
  });

  test('test-swagger-ui-/', (done) => {
    request
      .get('/swagger-ui/')
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.text).toMatch('swagger-ui-bundle.js');
        return done();
      });
  });

  test('test-swagger-json', async () => {
    await request
      .get('/swagger-ui/index.json')
      .expect(200)
      .then((response) => {
        expect(response.body.tags[0].name).toBe('首页');
      });
    return request
      .get('/swagger-ui/index.json')
      .expect(200)
      .then((response) => {
        expect(response.body.tags[0].name).toBe('首页');
      });
  });

  test('test-home', (done) => {
    request
      .get('/home')
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.text).toMatch('hello home');
        return done();
      });
  });

  test('test-home-list', (done) => {
    request
      .get('/home/list')
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.text).toMatch('');
        return done();
      });
  });

  test('test-home-error', (done) => {
    request
      .get('/home/error')
      .expect(500)
      .end((err) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });

  test('test-swagger-initializer.js', (done) => {
    request
      .get('/swagger-ui/swagger-initializer.js')
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.text).toMatch('window.onload');
        return done();
      });
  });

  test('test-swagger-index.css', (done) => {
    request
      .get('/swagger-ui/index.css')
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.text).toMatch('html');
        return done();
      });
  });

  test('test-swagger-favicon-16x16.png', () => {
    return request.get('/swagger-ui/favicon-16x16.png').expect(200);
  });
  test('test-swagger-ui-bundle.js.map', () => {
    return request.get('/swagger-ui/swagger-ui-bundle.js.map').expect(200);
  });
});
