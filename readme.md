# Chumi · [![NPM version](https://img.shields.io/npm/v/chumi.svg)](https://www.npmjs.com/package/chumi) [![build](https://img.shields.io/circleci/build/github/chumijs/chumi/master.svg)](https://circleci.com/gh/chumijs/chumi) [![coverage](https://img.shields.io/codecov/c/github/chumijs/chumi/master.svg)](https://app.codecov.io/gh/chumijs/chumi/tree/master) 

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
  ApiTags,
  loadService
} from 'chumi';
```
