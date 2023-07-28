import { Context } from 'koa';
import { Service, loadController, loadService } from '../../../../chumi';
import Chain from '../Controllers/Chain';

// Service类
@Service
export default class S1 {
  ctx: Context;
  chain = loadController(Chain);
  s1 = loadService(S1);
}
