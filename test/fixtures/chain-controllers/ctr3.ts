import { Context } from 'koa';

import { Controller, Get, Query, loadController } from '../../../chumi';
import Ctr2 from './ctr2';

@Controller('/ctr3')
export default class Ctr3 {
  ctx: Context;
  ctr2 = loadController(Ctr2);

  @Get('/to3')
  async index(@Query('name') name: string) {
    return { name: (await this.ctr2.index(name)).name + this.ctx.def };
  }

  @Get('/to3-error')
  async indexError(@Query('name') name: string) {
    return await this.ctr2.indexError_(name);
  }
}
