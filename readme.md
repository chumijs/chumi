# Chumi · [![NPM version](https://img.shields.io/npm/v/chumi.svg)](https://www.npmjs.com/package/chumi)

**基于koa的运行时的注解业务框架的中间件 · [文档](https://ph9o1wkcdp.feishu.cn/docx/UGCfdJVisokyQLxi2Rocuy4fn7f)**

![image.png](https://s1.ax1x.com/2023/03/07/ppeFpUP.png)

## 功能
1. - [x] 解决运行时丢失TypeScript类型标注的问题，这很关键，否则所谓的类型注解将没有任何意义
2. - [x] Controller层注解
3. - [x] Service层注解
4. - [x] Service引用Service，同时保证注入的ctx上下文是一致性的
5. - [ ] 单元测试
6. - [ ] 支持swagger

## 调试

```sh
$ yarn tsx sample/server.ts
```