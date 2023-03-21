# Chumi · [![NPM version](https://img.shields.io/npm/v/chumi.svg)](https://www.npmjs.com/package/chumi) [![build](https://img.shields.io/circleci/build/github/chumijs/chumi/master.svg)](https://circleci.com/gh/chumijs/chumi) [![coverage](https://img.shields.io/codecov/c/github/chumijs/chumi/master.svg)](https://app.codecov.io/gh/chumijs/chumi/tree/master) 

基于koa，在运行时，提供Controller、Route、Parameter、Service等功能的注解的中间件框架，可以在任何支持koa中间件的项目或者框架里面使用

## 示例

1. [⚡️ koa、vite、vue3](https://github.com/chumijs/chumi-vite)

2. [🥚 Egg](https://github.com/chumijs/chumi-egg)

3. [🍔 Midway](https://github.com/chumijs/chumi-midway)

4. [🦅 Nest](https://github.com/chumijs/chumi-nest)

5. [🎨 Next.js](https://github.com/chumijs/chumi-next)

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
  ApiTags,
  loadService
} from 'chumi';
```
