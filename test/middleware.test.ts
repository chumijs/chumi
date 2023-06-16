import { Server } from 'http';
import supertest from 'supertest';
import app from './fixtures/middleware';

describe('Middleware test', () => {
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
    const res1 = await request.get('/home').then((res) => res.text);
    expect(res1).toMatch(JSON.stringify({ ret: 0, data: 'hello home' }));

    const res2 = await request.get('/detail').then((res) => res.text);
    expect(res2).toMatch(JSON.stringify({ ret: 0, data: 'hello detaildetail' }));

    const res3 = await request.get('/detail2').then((res) => res.text);
    expect(res3).toMatch(JSON.stringify({ ret: 0, data: 'hello detail' }));

    const res4 = await request
      .get('/swagger-ui/index.json')
      .expect(200)
      .then((res) => res.text);

    expect(res4).toBe(
      JSON.stringify({
        openapi: '3.0.1',
        info: {
          title: 'My Project',
          description: 'This is a swagger-ui for chumi',
          version: '1.0.0',
          contact: {}
        },
        tags: [],
        paths: {
          '/home/': {
            get: { parameters: [], tags: [], responses: { '200': { description: 'OK' } } }
          },
          '/detail2/': {
            get: { parameters: [], tags: [], responses: { '200': { description: 'OK' } } }
          },
          '/detail/': {
            get: { parameters: [], tags: [], responses: { '200': { description: 'OK' } } }
          }
        }
      })
    );
  });
});
