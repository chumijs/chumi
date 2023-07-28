import { Context } from 'koa';
import { Service } from '../../chumi';

// Service类
@Service
export default class {
  ctx: Context;
  a() {
    return 123;
  }
}
