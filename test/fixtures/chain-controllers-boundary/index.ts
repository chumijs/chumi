import Koa, { Context } from 'koa';

import chumi, { Controller, Get, Query, loadController } from '../../../chumi';

@Controller('/ctr1')
class Ctr1 {
  ctx: Context;
  @Get('/to1')
  async index(@Query('name') name: string) {
    return { name: `${name}_${(this as any).abcd ?? 2}` };
  }
}

@Controller('/ctr2')
class Ctr2 {
  ctx: Context;
  ctr1 = loadController(Ctr1);

  @Get('/to2')
  async index(@Query('name') name: string) {
    return this.ctr1.index(name);
  }
}

const app = new Koa();

app.use(chumi([Ctr1, Ctr2]));

export default app;
