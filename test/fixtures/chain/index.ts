import Koa, { Context } from 'koa';
import chumi, { Controller, Get, Service, loadController, loadService } from '../../../chumi';

const app = new Koa();

@Controller()
class Ctr3 {
  ctx: Context;
  a() {
    return this.ctx.path;
  }
}

@Service
class S3 {
  Ctr3 = loadController(Ctr3);
}

@Controller()
class Ctr2 {
  S3 = loadService(S3);
}

@Controller()
class Ctr1 {
  Ctr2 = loadController(Ctr2);
}

@Service
class S2 {
  Ctr1 = loadController(Ctr1);
}

@Service
class S1 {
  S2 = loadService(S2);
}

@Controller()
class Home {
  S1 = loadService(S1);

  @Get('/:id')
  async index() {
    return this.S1.S2.Ctr1.Ctr2.S3.Ctr3.a();
  }
}

// Home -> S1 -> S2 -> Ctr1 -> Ctr2 -> S3 -> Ctr3
app.use(chumi([Home]));

export default app;
