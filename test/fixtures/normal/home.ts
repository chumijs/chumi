import {
  Body,
  Controller,
  Delete,
  Get,
  loadService,
  Param,
  Post,
  Put,
  Query
} from '../../../chumi';
import service from './service';

@Controller()
export default class {
  service = loadService(service);

  @Post('/api/user')
  async addUser(@Body('name') name: string) {
    return { name };
  }

  @Delete('/api/user/:id')
  async deleteUser(@Param.number('id') id: number) {
    return { id };
  }

  @Put('/api/user')
  async addPutUser(@Query('name') name: string) {
    return { name };
  }

  @Get('/api/path')
  async getPath() {
    return await this.service.getPath();
  }
}
