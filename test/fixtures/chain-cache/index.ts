import Koa, { Context } from 'koa';
import chumi, { Controller, Get, Service, loadController, loadService } from '../../../chumi';

const app = new Koa();

@Controller()
class Ctr3 {
  ctx: Context;
  async a() {
    return this.ctx.path;
  }
}

@Service
class S3 {
  Ctr3 = loadController(Ctr3);
  async a() {
    const a1 = await this.Ctr3.a();
    const a2 = await this.Ctr3.a();
    const a3 = await this.Ctr3.a();
    return { a1, a2, a3 };
  }
}

@Controller()
class Ctr2 {
  S3 = loadService(S3);
}

@Controller()
class Ctr1 {
  Ctr2 = loadController(Ctr2);
  async a() {
    const a1 = await this.Ctr2.S3.Ctr3.a();
    const a2 = await this.Ctr2.S3.Ctr3.a();
    const a3 = await this.Ctr2.S3.Ctr3.a();
    return { a1, a2, a3 };
  }
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
    return this.S1.S2.Ctr1.Ctr2.S3.a();
  }

  @Get('/:id/test')
  async test() {
    const a1 = await this.S1.S2.Ctr1.a();
    const a2 = await this.S1.S2.Ctr1.a();

    return { a1, a2 };
  }
}

// Home -> S1 -> S2 -> Ctr1 -> Ctr2 -> S3 -> Ctr3
app.use(chumi([Home]));

export default app;
