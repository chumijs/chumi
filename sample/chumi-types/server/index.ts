import Koa from 'koa';
import chumi from '../../../chumi';
import Chain from './Controllers/Chain';

const app = new Koa();

// const b: ChumiResponseData<typeof Chain, 'index'>;
// const c: ChumiResponseData<typeof Chain, 'b'>;

app.use(chumi([Chain]));

app.listen(9000);
