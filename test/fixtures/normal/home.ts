import {
  ApiTags,
  Body,
  Controller,
  Delete,
  Get,
  Header,
  loadService,
  Param,
  Post,
  Put,
  Query
} from '../../../chumi';
import service from './service';

@ApiTags('首页')
@Controller()
export default class {
  service = loadService(service);

  @Post('/api/user')
  async addUser(
    @Body('name') name: string,
    @Body.number('id') id1: number,
    @Body.string('id') id2: string
  ) {
    return { name, id1, id2 };
  }

  @Delete('/api/user/:id')
  async deleteUser(
    @Param.number('id') id: number,
    @Param('id') id1: number,
    @Param.string('id') id2: string
  ) {
    return { id, id1, id2 };
  }

  @Put('/api/user')
  async addPutUser(
    @Query('name') name: string,
    @Query.string('id') id1: string,
    @Query.number('id') id2: number
  ) {
    return { name, id1, id2 };
  }

  @Get('/api/path')
  async getPath(@Header('abc') abc: string) {
    // 调用两次service
    const path = await this.service.getPath();
    return (await this.service.getPath()) + ' ' + abc + ' ' + path;
  }
}
