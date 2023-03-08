import { Service } from '../chumi';
import { Context } from 'koa';

@Service
export default class {
  ctx: Context;

  async getPath() {
    return this.ctx.path;
  }
}
