import chumi from '../chumi';
import Koa from 'koa';

import HomeController from './home';
import UserController from './user';

const app = new Koa();

app.use(
  chumi([HomeController, UserController], {
    koaBody: {},
    swagger: {
      tags: [{ name: '测试首页', description: '用来测试首页的接口' }]
    }
  })
);

app.listen(3000, () => {
  console.log('> http://localhost:3000/api/test?name=123');
});
