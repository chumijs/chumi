import Koa, { Context } from 'koa';
import chumi, { Controller, Get, Service, loadController, loadService } from '../../chumi';

const app = new Koa();

// Service类
@Service
class S1 {
  ctx: Context;
  chain = loadController(Chain);
  s1 = loadService(S1);
}

// Controller类
@Controller()
class Chain {
  ctx: Context;
  chain = loadController(Chain);
  s1 = loadService(S1);

  async result() {
    return this.ctx.path;
  }

  @Get('/')
  async index() {
    // 支持无限调用下去，不管是在service，还是controller，都是支持的
    return this.chain.chain.s1.s1.chain.chain.s1.s1.chain.chain.s1.s1.chain.chain.result();
  }
}

app.use(chumi([Chain]));

app.listen(9000);
