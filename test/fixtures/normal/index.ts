import Koa from 'koa';
import chumi from '../../../chumi';

import HomeController from './home';

const app = new Koa();

app.use(
  chumi([HomeController], {
    koaBody: {
      multipart: true,
      parsedMethods: ['GET', 'POST', 'DELETE', 'PUT'],
      formidable: {
        maxFileSize: 20000 * 1024 * 1024 * 10 // 设置上传文件大小最大限制，默认200M
      }
    },
    swagger: {}
  })
);

export default app;
