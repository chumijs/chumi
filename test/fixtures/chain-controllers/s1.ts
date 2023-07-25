import { Context } from 'koa';
import { Service } from '../../../chumi';

@Service
export default class Service1 {
  ctx: Context;
  a = 2;
  async t1(name: string) {
    return this.ctx.path + '_' + this.a + '_' + name + '$$' + this.ctx.abc;
  }

  async t2(name: string) {
    throw new Error(name);
  }
}
