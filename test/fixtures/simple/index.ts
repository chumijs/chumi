import Koa from 'koa';
import chumi, { Controller, Get } from '../../../chumi';

const app = new Koa();

@Controller()
class Home {
  @Get('/')
  async index() {
    return 'hello world';
  }

  @Get(2 as any)
  async t() {
    return '3';
  }
}

app.use(chumi([Home]));

export default app;
