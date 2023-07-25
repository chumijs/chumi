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
}
