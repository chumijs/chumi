import { Context } from 'koa';
import { Service, loadController } from '../../../chumi';
import Ctr1 from './ctr1';

@Service
export default class Service2 {
  ctx: Context;
  a = 2;
  ctr1 = loadController(Ctr1);

  async t1(name: string) {
    return this.ctx.path + '_' + this.a + '_' + name + '$$' + this.ctx.abc;
  }

  async t2(name: string) {
    throw new Error(name);
  }

  async t3(name: string) {
    const c1 = await this.ctr1.index(name);
    return { key: this.ctx.path + '_t3_' + name, ...c1 };
  }
}
