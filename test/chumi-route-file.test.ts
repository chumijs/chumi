/**
 * 文件上传 @Files
 * 支持form-data @fields
 */
import Koa, { Context } from 'koa';
import path from 'path';
import supertest from 'supertest';
import chumi, { ALL, Controller, Files, Post } from '../chumi';
import { File, Files as FilesType } from 'formidable';

describe('files', () => {
  const serverInstance = [];

  afterAll(() => {
    serverInstance.forEach((server) => server.close());
  });

  test('file upload', (done) => {
    const app = new Koa();
    @Controller()
    class Sample {
      ctx: Context;

      @Post('/upload')
      async upload(@Files('file') files: FilesType) {
        if (Array.isArray(files)) {
          return files
            .map((item) => item.originalFilename)
            .sort()
            .join(',');
        }
        return files.originalFilename;
      }
    }
    app.use(chumi([Sample], { koaBody: { multipart: true } }));

    const server = app.listen();
    const request = supertest(server);

    serverInstance.push(server);

    (async () => {
      const res = await request
        .post('/upload')
        .set('Content-Type', 'multipart/form-data')
        .field('test', 'uploadFile')
        .attach('file', path.join(__dirname, './fixtures/normal/home.ts'))
        .attach('file', path.join(__dirname, './fixtures/small/index.ts'))
        .then((res) => res.text);
      expect(res).toBe(`home.ts,index.ts`);
      done();
    })();
  });

  test('file upload all', (done) => {
    const app = new Koa();
    @Controller()
    class Sample {
      ctx: Context;

      @Post('/upload')
      async upload(@Files(ALL) files: Record<string, File>) {
        return [files.file1.originalFilename, files.file2.originalFilename].sort().join(',');
      }
    }
    app.use(chumi([Sample], { koaBody: { multipart: true } }));

    const server = app.listen();
    const request = supertest(server);

    serverInstance.push(server);

    (async () => {
      const res = await request
        .post('/upload')
        .set('Content-Type', 'multipart/form-data')
        .field('test', 'uploadFile')
        .attach('file1', path.join(__dirname, './fixtures/normal/home.ts'))
        .attach('file2', path.join(__dirname, './fixtures/small/index.ts'))
        .then((res) => res.text);
      expect(res).toBe(`home.ts,index.ts`);
      done();
    })();
  });
});
