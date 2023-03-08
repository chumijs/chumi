import { Controller, Get, loadService, Query } from '../chumi';
import { Context } from 'koa';
import service from './service';

@Controller()
export default class {
  ctx: Context;

  service = loadService(service);

  @Get('/api/test')
  async getTest(@Query('name') name: string) {
    return (
      `name: ${name} ` + `method: ${this.ctx.method} ` + `path: ${await this.service.getPath()}`
    );
  }
}
