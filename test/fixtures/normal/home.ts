import { ApiTags, Controller, Get } from '../../../chumi';

@ApiTags(['首页'])
@Controller('/home', {
  middlewares: [
    async (ctx, next) => {
      await next();
    }
  ]
})
export default class {
  errorStr = 'error';

  getText() {
    return 'hello home';
  }

  @Get('/')
  async index() {
    return this.getText();
  }

  @Get('/error', { summary: '错误测试接口' })
  async error() {
    throw new Error(this.errorStr + (this as any).abc);
  }

  @Get('/list')
  async list() {
    return null;
  }
}
