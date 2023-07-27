import { Context } from 'koa';

import { Controller, Get, Query, loadService } from '../../../chumi';
import Service1 from './s1';

@Controller('/ctr1', {
  middlewares: [
    async (ctx, next) => {
      ctx.abc = 123;
      try {
        await next();
      } catch (error) {
        ctx.body = { name: error.message };
      }
    }
  ]
})
export default class Ctr1 {
  ctx: Context;
  s1 = loadService(Service1);
  // 通用能力
  @Get('/to1')
  async index(@Query('name') name: string) {
    console.log(3333, this.s1, name, this.ctx.abc);
    return { name: `${name}_${await this.s1.t1(name)}_${this.ctx.abc}` };
  }

  @Get('/to1-error')
  async indexError(@Query('name') name: string) {
    return { name: `${name}_${await this.s1.t2(name)}_${this.ctx.abc}` };
  }
}
