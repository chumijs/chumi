import {
  ALL,
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

@ApiTags('用户')
@Controller()
export default class {
  service = loadService(service);

  @Post('/api/user')
  async addUser(
    @Body('name') name: string,
    @Body.number('id') id1: number,
    @Body.string('id') id2: string,
    @Body(ALL) all: any
  ) {
    return { name, id1, id2, all };
  }

  @Delete('/api/user/:id')
  async deleteUser(
    @Param.number('id') id: number,
    @Param('id') id1: number,
    @Param.string('id') id2: string,
    @Param(ALL) all: any
  ) {
    return { id, id1, id2, all };
  }

  @Put('/api/user')
  async addPutUser(
    @Query('name') name: string,
    @Query.string('id') id1: string,
    @Query.number('id') id2: number,
    @Query(ALL) all: any
  ) {
    return { name, id1, id2, all };
  }

  @Get('/api/path')
  async getPath(@Header('abc') abc: string) {
    // 调用两次service
    const path = await this.service.getPath();
    return (await this.service.getPath()) + ' ' + abc + ' ' + path;
  }

  @Get('/api/headers')
  async getHeader(@Header(ALL) all: any) {
    return all.abc;
  }
}
