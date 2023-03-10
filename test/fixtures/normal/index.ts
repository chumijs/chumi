import Koa from 'koa';
import chumi from '../../../chumi';

import HomeController from './home';
import UserController from './user';

const app = new Koa();

app.use(
  chumi([HomeController, UserController], {
    koaBody: {
      multipart: true,
      parsedMethods: ['GET', 'POST', 'DELETE', 'PUT'],
      formidable: {
        maxFileSize: 20000 * 1024 * 1024 * 10 // 设置上传文件大小最大限制，默认200M
      }
    },
    swagger: {
      tags: [{ name: '首页', description: '' }]
    }
  })
);

export default app;
