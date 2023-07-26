import { Context } from 'koa';

import { Controller, Get, Query, loadController, loadService } from '../../../chumi';
import Ctr1 from './ctr1';
import Service1 from './s1';

@Controller('/ctr2')
export default class Ctr2 {
  ctx: Context;
  ctr1 = loadController(Ctr1);

  s1 = loadService(Service1);

  @Get('/to2')
  async index(@Query('name') name: string) {
    return await this.ctr1.index(name);
  }

  @Get('/to2-error')
  async indexError(@Query('name') name: string) {
    return await this.ctr1.indexError(name);
  }

  @Get('/to2-error_')
  async indexError_(@Query('name') name: string) {
    return await this.s1.t2(name);
  }

  @Get('/to2-more')
  async indexMore(@Query('name') name: string) {
    const c1 = await this.ctr1.index(name);
    const c2 = await this.ctr1.index(name);
    const c3 = await this.ctr1.index(name);

    return { ...(await this.ctr1.index(name)), c1, c2, c3 };
  }
}
