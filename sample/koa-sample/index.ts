import Koa from 'koa';
import KoaRouter from 'koa-router';

const app = new Koa();

const router = new KoaRouter();

router.get(/\/users\/(\d+)$/, async (ctx) => {
  console.log(ctx.query, ctx.params);
  ctx.body = 'hello';
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(9091);
