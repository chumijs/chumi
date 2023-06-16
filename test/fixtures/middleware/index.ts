import Koa from 'koa';
import chumi, { Controller, Get } from '../../../chumi';

const app = new Koa();

@Controller()
class Home {
  @Get('/')
  async index() {
    return 'hello home';
  }
}

@Controller()
class Detail {
  ctx: Koa.Context;

  @Get('/')
  async index() {
    return 'hello detail' + (this.ctx.name ?? '');
  }
}

app.use(
  chumi<Koa.Context>(
    {
      '/home': [Home],
      '/detail2': {
        controllers: [Detail]
      },
      '/detail': {
        controllers: [Detail],
        middlewares: [
          async (ctx, next) => {
            ctx.name = 'detail';
            await next();
          }
        ]
      }
    },
    {
      swagger: {},
      controllerMiddlewares: [
        async (ctx, next) => {
          await next();
          ctx.body = { ret: 0, data: ctx.body };
        }
      ]
    }
  )
);

export default app;
