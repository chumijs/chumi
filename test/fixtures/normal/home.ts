import { ApiTags, Controller, Get } from '../../../chumi';

@ApiTags(['首页'])
@Controller('/home')
export default class {
  getText() {
    return 'hello home';
  }

  @Get('/')
  async index() {
    return this.getText();
  }

  @Get('/error', { summary: '错误测试接口' })
  async error() {
    throw new Error('error');
  }
}
