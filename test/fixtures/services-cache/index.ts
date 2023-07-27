import Koa from 'koa';

import chumi, { Controller, Get, Service, loadService } from '../../../chumi';

@Service
class B {
  a() {
    return 'a';
  }
}

@Service
class A {
  B = loadService(B);
  a() {
    const a1 = this.B.a();
    const a2 = this.B.a();
    const a3 = this.B.a();
    return { a1, a2, a3 };
  }
}

@Service
class Main {
  A = loadService(A);
  async index() {
    const a1 = this.A.a();
    const a2 = this.A.a();
    const a3 = this.A.a();
    return { a1, a2, a3 };
  }
}

@Controller('/')
class Ctr {
  main = loadService(Main);

  @Get('/:id')
  async index() {
    return this.main.index();
  }
}

const app = new Koa();

app.use(chumi([Ctr]));

export default app;
