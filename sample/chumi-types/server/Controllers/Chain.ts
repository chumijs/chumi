import { Context } from 'koa';
import { Controller, Get, loadController, loadService } from '../../../../chumi';
import S1 from '../Services/S1';

// Controller类
@Controller()
export default class Chain {
  ctx: Context;
  chain = loadController(Chain);
  s1 = loadService(S1);

  async result() {
    return this.ctx.path;
  }

  @Get('/a')
  async a() {
    return this.chain.chain.s1.s1.chain.chain.s1.s1.chain.chain.s1.s1.chain.chain.result();
  }

  @Get('/b')
  async b() {
    return {
      a: await this.chain.chain.s1.s1.chain.chain.s1.s1.chain.chain.s1.s1.chain.chain.result(),
      b: 2
    };
  }

  @Get('/c')
  c() {
    return [{ a: 2 }, { a: 3 }];
  }
}
