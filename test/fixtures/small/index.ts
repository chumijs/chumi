import Koa from 'koa';
import chumi, { Controller, Get } from '../../../chumi';

const app = new Koa();

@Controller()
class Home {
  @Get('/')
  async index() {
    return 'hello world';
  }
}

app.use(chumi([Home]));

export default app;
