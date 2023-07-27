import { Context } from 'koa';
import { Service, loadController, loadService } from '../../../chumi';
import Ctr1 from './ctr1';
import Service2 from './s2';

@Service
export default class Service1 {
  ctx: Context;
  a = 2;
  s2 = loadService(Service2);
  ctr1 = loadController(Ctr1);

  async t1(name: string) {
    console.log('findddd');
    return this.ctx.path + '_' + this.a + '_' + name + '$$' + this.ctx.abc;
  }

  async t2(name: string) {
    throw new Error(name);
  }

  async t3(name: string) {
    const c1 = await this.s2.t3(name);
    const c2 = await this.s2.t3(name);
    console.log('c1', c1);
    return { key: this.ctx.path + '_t3_' + name, ...c1, ...c2 };
  }
}
