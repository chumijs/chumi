import { Context } from 'koa';
import {
  ChumiRequestData,
  ChumiResponseData,
  Controller,
  Get,
  Query,
  loadController,
  loadService
} from '../../../../chumi';
import S1 from '../Services/S1';

// Controller类
@Controller()
export default class Chain {
  ctx: Context;
  chain = loadController(Chain);
  s1 = loadService(S1);

  async result() {
    return this.ctx.path;
  }

  /**
   * /a
   * @param name
   * @param id
   * @returns
   */
  @Get('/a')
  async a(@Query('name') name: string, @Query('id') id: number) {
    return this.chain.chain.s1.s1.chain.chain.s1.s1.chain.chain.s1.s1.chain.chain.result();
  }

  @Get('/b')
  async b() {
    return {
      a: await this.chain.chain.s1.s1.chain.chain.s1.s1.chain.chain.s1.s1.chain.chain.result(),
      b: 2
    };
  }

  @Get('/c')
  c() {
    return [{ a: 2 }, { a: 3 }];
  }
}

type a = ChumiResponseData<typeof Chain, 'a'>;
type b = ChumiRequestData<typeof Chain, 'a'>;

const m: (...args: b) => void = (name, id) => {
  console.log(1);
};

m('1', 2);
