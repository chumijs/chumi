# Chumi · [![NPM version](https://img.shields.io/npm/v/chumi.svg)](https://www.npmjs.com/package/chumi) [![build](https://img.shields.io/circleci/build/github/chumijs/chumi/master.svg)](https://circleci.com/gh/chumijs/chumi) [![coverage](https://img.shields.io/codecov/c/github/chumijs/chumi/master.svg)](https://app.codecov.io/gh/chumijs/chumi/tree/master) · [DOCUMENTATION](https://juejin.cn/post/7208099384071192635)

> **基于koa，在运行时，提供Controller、Route、Parameter、Service等功能注解的中间件框架**
>
> **可以在任何支持koa中间件的项目或者框架里面使用**
>
> **核心代码目录：** [`chumi/`](./chumi/)

![image.png](https://s1.ax1x.com/2023/03/09/ppnJJeA.png)



## 功能
1. - [x] 解决运行时丢失TypeScript类型标注的问题，这很关键，否则所谓的类型注解将没有任何意义
2. - [x] Controller层注解
3. - [x] Service层注解
4. - [x] Service引用Service，同时保证注入的ctx上下文是一致性的
5. - [x] 单元测试
6. - [x] 支持swagger
7. - [ ] serverless

## 调试

```sh
$ yarn tsx sample/server.ts
```

## 测试

```sh
$ yarn test
```

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
  ApiTags,
  loadService
} from 'chumi';
```
