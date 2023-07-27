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

  @Get('/to3-more')
  async indexMore(@Query('name') name: string) {
    const c1 = await this.ctr2.indexMore(name);
    const c2 = await this.ctr2.indexMore(name);
    const c3 = await this.ctr2.indexMore(name);

    return { name: (await this.ctr2.indexMore(name)).name + this.ctx.def, c1, c2, c3 };
  }

  @Get('/to3-ctr2-s1-ctr1')
  async indexCtr2S1Ctr1(@Query('name') name: string) {
    return await this.ctr2.indexS1Ctr1(name);
  }
}
