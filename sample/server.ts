import chumi from '../chumi';
import Koa from 'koa';

import HomeController from './home';

const app = new Koa();

app.use(
  chumi([HomeController], {
    koaBody: {}
  })
);

app.listen(3000, () => {
  console.log('> http://localhost:3000/api/test?name=123');
});
