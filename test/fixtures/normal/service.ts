import { Context } from 'koa';
import { loadService, Service } from '../../../chumi';
import commonService from './common.service';

@Service
export default class {
  ctx: Context;

  common = loadService(commonService);

  async getPath() {
    const method = await this.common.getMethod();
    return this.ctx.path + ' ' + (await this.common.getMethod()) + method;
  }
}
