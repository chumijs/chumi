import Koa from 'koa';

import chumi, { Controller, Get, Query, Service, loadService } from '../../../chumi';

@Service
class D {
  d() {
    return 'd';
  }
}

@Service
class A {
  b = null;
  a() {
    return 'a';
  }
}

@Service
class B {
  b() {
    return 'b';
  }
}

@Service
class C {
  D = loadService(D);
  c() {
    return 'c';
  }

  d() {
    return this.D.d();
  }
}

@Service
class Main {
  A = loadService(A);
  B = loadService(B);
  C = loadService(C);
  D = 2;
}

@Controller('/')
class Ctr {
  main = loadService(Main);

  @Get('/')
  async index(@Query('name') name: string, @Query('action') action: string) {
    return this.main?.[name]?.[action]?.() ?? this.main?.[name]?.[action] ?? this.main?.[name];
  }

  @Get('/t')
  async t() {
    return this.main.C.D.d();
  }
}

const app = new Koa();

app.use(chumi([Ctr]));

export default app;
