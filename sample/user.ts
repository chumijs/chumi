import { ApiTags, Controller, Delete, Get, loadService, Param, Post, Put, Query } from '../chumi';
import { Context } from 'koa';
import service from './service';

@ApiTags(['测试用户'])
@Controller()
export default class {
  ctx: Context;

  service = loadService(service);

  @Post('/api/test/:id', { summary: '基础测试1' })
  async getTest(@Query('name') name: string, @Param.number('id') id: number) {
    return (
      `name: ${name} ` + `method: ${this.ctx.method} ` + `path: ${await this.service.getPath()}`
    );
  }

  @Put('/api/test/:id', { summary: '基础测试2' })
  async getTest1(@Query('name') name: string, @Param.number('id') id: number) {
    return (
      `name: ${name} ` + `method: ${this.ctx.method} ` + `path: ${await this.service.getPath()}`
    );
  }
}
