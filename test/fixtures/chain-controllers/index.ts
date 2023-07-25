import Koa from 'koa';

import chumi from '../../../chumi';
import Ctr1 from './ctr1';
import Ctr2 from './ctr2';
import Ctr3 from './ctr3';

const app = new Koa();

app.use(
  chumi([Ctr1, Ctr2, Ctr3], {
    controllerMiddlewares: [
      async (ctx, next) => {
        ctx.def = 'controllerMiddlewares';
        await next();
      }
    ]
  })
);

export default app;
