import { Context } from 'koa';
import { Service } from '../../../chumi';

@Service
export default class {
  ctx: Context;

  async getPath() {
    return this.ctx.path;
  }
}
