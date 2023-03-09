import { ApiTags, Controller, Delete, Get, loadService, Param, Query } from '../chumi';
import { Context } from 'koa';
import service from './service';

@ApiTags(['测试首页'])
@Controller()
export default class {
  ctx: Context;

  service = loadService(service);

  @Get('/api/test/:id', { summary: '基础测试3' })
  async getTest(@Query('name') name: string, @Param.number('id') id: number) {
    return (
      `name: ${name} ` + `method: ${this.ctx.method} ` + `path: ${await this.service.getPath()}`
    );
  }

  @Delete('/api/test/:id', { summary: '基础测试4' })
  async getTest1(@Query('name') name: string, @Param.number('id') id: number) {
    return (
      `name: ${name} ` + `method: ${this.ctx.method} ` + `path: ${await this.service.getPath()}`
    );
  }
}
