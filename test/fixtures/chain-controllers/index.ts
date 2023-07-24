import Koa, { Context } from 'koa';

import chumi, {
  Controller,
  Get,
  Query,
  Service,
  loadController,
  loadService
} from '../../../chumi';

@Service
class Service1 {
  ctx: Context;
  a = 2;
  async t1(name: string) {
    return this.ctx.path + '_' + this.a + '_' + name + '$$' + this.ctx.abc;
  }
}

@Controller('/ctr1', {
  middlewares: [
    async (ctx, next) => {
      ctx.abc = 123;
      await next();
    }
  ]
})
class Ctr1 {
  ctx: Context;
  s1 = loadService(Service1);
  @Get('/to2')
  async index(@Query('name') name: string) {
    return { name: `${name}_${await this.s1.t1(name)}_${this.ctx.abc}` };
  }

  @Get('/')
  async normal(@Query('name') name: string) {
    return { name };
  }
}

@Controller('/ctr2')
class Ctr2 {
  ctx: Context;
  ctr1 = loadController(Ctr1);

  @Get('/to1')
  async index(@Query('name') name: string) {
    return this.ctr1.index(name);
  }

  @Get('/')
  async normal(@Query('name') name: string) {
    return { name };
  }
}

const app = new Koa();

app.use(chumi([Ctr1, Ctr2]));

export default app;
