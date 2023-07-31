# Chumi · [![NPM version](https://img.shields.io/npm/v/chumi.svg)](https://www.npmjs.com/package/chumi) [![build](https://img.shields.io/circleci/build/github/chumijs/chumi/master.svg)](https://circleci.com/gh/chumijs/chumi) [![coverage](https://img.shields.io/codecov/c/github/chumijs/chumi/master.svg)](https://app.codecov.io/gh/chumijs/chumi/tree/master) [![NPM downloads](http://img.shields.io/npm/dm/chumi.svg)](http://www.npmtrends.com/chumi) [![stackblitz demo](https://img.shields.io/badge/stackblitz-chumi-brightgreen)](https://stackblitz.com/edit/node-h13evz)

基于koa，在运行时，提供Controller、Route、Parameter、Service等功能的注解的中间件框架，可以在任何支持koa中间件的项目或者框架里面使用

## 示例

1. [⚡️ 使用koa、vite、vue3搭建一个原始的全栈开发环境，集成chumi示例，帮助开发者更好的组织后端业务代码](https://github.com/chumijs/chumi-vite)

2. [🥚 Egg框架 - 集成chumi示例，由于chumi的多实例特性，可以集成到Egg插件，**目前已经在生产使用验证过**](https://github.com/chumijs/chumi-egg)

3. [🍔 Midway框架 - 集成chumi示例](https://github.com/chumijs/chumi-midway)

4. [🦅 Nest框架 - 集成chumi示例](https://github.com/chumijs/chumi-nest)

5. [🎨 Next.js框架 - 集成chumi示例](https://github.com/chumijs/chumi-next)

6. 🤟 欢迎提供更多的示例...

## 架构图

![image.png](https://s1.ax1x.com/2023/03/09/ppnJJeA.png)

## Apis

```ts
import chumi, {
  Controller,
  Service,
  Get,
  Post,
  Delete,
  Put,
  Param,
  Query,
  Body,
  Header,
  Files,
  ApiTags,
  loadService,
  loadController,
  ChumiRequestData,   // TypeScript Types
  ChumiResponseData,  // TypeScript Types
} from 'chumi';
```

## 星链互联

> 拷贝如下代码即可体验。也可以克隆当前项目，安装依赖后，直接使用命令`yarn tsx sample/chumi-chain`运行即可

```ts
import Koa, { Context } from 'koa';
import chumi, { Controller, Get, Service, loadController, loadService } from 'chumi';

const app = new Koa();

// Service类
@Service
class S1 {
  ctx: Context;
  chain = loadController(Chain);
  s1 = loadService(S1);
}

// Controller类
@Controller()
class Chain {
  ctx: Context;
  chain = loadController(Chain);
  s1 = loadService(S1);

  async result() {
    return this.ctx.path;
  }

  @Get('/')
  async index() {
    // 支持无限调用下去，不管是在service，还是controller，都是支持的
    return this.chain.chain.s1.s1.chain.chain.s1.s1.chain.chain.s1.s1.chain.chain.result();
  }
}

app.use(chumi([Chain]));

app.listen(9000);

```

## 全栈友好

> 1. chumi提供了`ChumiRequestData`和`ChumiResponseData`类型推导泛型函数，可以把控制器函数的入参和返回值类型推断出来
>
> 2. 方便在全栈项目中，前后端在接口这一块的入参和出参的数据类型保持一致
>
> 3. 具体可以参考完整项目 [`sample/chumi-types`](https://github.com/chumijs/chumi/blob/master/sample/chumi-types)，克隆当前项目，安装依赖后，执行`yarn vite dev --config sample/chumi-types/client/vite.config.ts`命令即可

```ts
// 核心示例代码
import { ChumiRequestData,ChumiResponseData } from 'chumi';

// 接口通用返回格式，我们往往会用到data
// 这里的data就是对应控制器函数的返回值
export interface ApiResponse<T> {
  ret: 0 | -1;
  msg: string;
  data: T;
}

// 对定义API请求的函数的类型定义
export type ApiFunction<
  T extends abstract new (...args: any) => any,
  S extends keyof InstanceType<T>
> = (...args: ChumiRequestData<T, S>) => Promise<ApiResponse<ChumiResponseData<T, S>>>;

export type ApiResponseData<
  T extends abstract new (...args: any) => any,
  S extends keyof InstanceType<T>
> = (ReturnType<ApiFunction<T, S>> extends Promise<infer U> ? U : never)['data'];

// 使用
// 比如我有导入的控制器类为Ctr1，其上面有一个函数getName
// 那么可以在前端定义如下接口函数
export const getName: ApiFunction<typeof Ctr1, 'getName'> = async (id) => {
  return await request.get(`/api/getName?id=${id}`);
};

// 获取Ctr1控制器里面的getName函数的返回值类型
// 这里返回的数据，将直接提供给前端使用
// 所以在全栈项目中，通过该类型，保证了前后端数据的一致性，提升健壮性
export type getNameData = ApiResponseData<typeof Ctr1, 'getName'>;
```

## 更新日志

点击查看详细的[更新日志](https://github.com/chumijs/chumi/blob/master/CHANGELOG.md)

## License

[MIT](https://github.com/chumijs/chumi/blob/master/LICENSE)

Copyright (c) 2023-present, Topthinking

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fchumijs%2Fchumi.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fchumijs%2Fchumi?ref=badge_large)
