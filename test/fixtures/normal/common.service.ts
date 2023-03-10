import { Context } from 'koa';
import { Service } from '../../../chumi';

@Service
export default class {
  ctx: Context;
  async getMethod() {
    return this.ctx.method;
  }
}
