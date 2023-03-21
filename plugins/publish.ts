import type { Plugin } from 'vite';
import fs from 'fs-extra';
import path from 'path';
import { spawn } from 'child_process';

export default function compressServerCode() {
  return {
    name: 'compress-server-code',
    apply: 'build',
    enforce: 'post',
    async closeBundle() {
      await new Promise((resolve) => {
        const run = spawn(
          path.join(__dirname, '..', 'node_modules/.bin/tsc'),
          [
            '--baseUrl',
            'chumi',
            '--tsBuildInfoFile',
            './lib/.tsbuildinfo',
            '--declarationDir',
            './lib/types'
          ],
          {
            cwd: path.join(__dirname, '..'),
            stdio: 'inherit'
          }
        );
        run.on('close', resolve);
      });

      fs.removeSync(path.join(__dirname, '..', 'lib', '.tsbuildinfo'));
      fs.moveSync(
        path.join(__dirname, '..', 'lib', 'types/chumi'),
        path.join(__dirname, '..', 'lib/chumi')
      );
      fs.removeSync(path.join(__dirname, '..', 'lib', 'types'));
      fs.renameSync(
        path.join(__dirname, '..', 'lib/chumi'),
        path.join(__dirname, '..', 'lib/types')
      );

      const version = require(path.join(__dirname, '..', 'package.json')).version;

      /**
       * 写入package.json
       */
      fs.writeFileSync(
        path.join(__dirname, '..', 'lib', 'package.json'),
        JSON.stringify({
          name: 'chumi',
          version,
          main: 'index.js',
          types: 'types/index.d.ts',
          dependencies: {
            '@types/koa': '^2.13.5',
            koa: '^2.14.1',
            'koa-body': '^5.0.0',
            'koa-compose': '^4.1.0',
            'koa-router': '^10.1.1',
            'swagger-ui-dist': '^4.18.0'
          },
          repository: 'git@github.com:chumijs/chumi.git',
          author: 'topthinking',
          license: 'MIT'
        })
      );

      /**
       * 写入markdown
       */
      fs.writeFileSync(
        path.join(__dirname, '..', 'lib', 'readme.md'),
        `# Chumi · [![NPM version](https://img.shields.io/npm/v/chumi.svg)](https://www.npmjs.com/package/chumi) [![build](https://img.shields.io/circleci/build/github/chumijs/chumi/master.svg)](https://circleci.com/gh/chumijs/chumi) [![coverage](https://img.shields.io/codecov/c/github/chumijs/chumi/master.svg)](https://app.codecov.io/gh/chumijs/chumi/tree/master)

基于koa，在运行时，提供Controller、Route、Parameter、Service等功能的注解的中间件框架，可以在任何支持koa中间件的项目或者框架里面使用

## 示例

1. [⚡️ 使用koa、vite、vue3搭建一个原始的全栈开发环境，集成chumi示例，帮助开发者更好的组织后端业务代码](https://github.com/chumijs/chumi-vite)

2. [🥚 Egg框架 - 集成chumi示例，由于chumi的多实例特性，可以在插件里面使用chumi，**目前已经在生产使用验证过**](https://github.com/chumijs/chumi-egg)

3. [🍔 Midway框架 - 集成chumi示例](https://github.com/chumijs/chumi-midway)

4. [🦅 Nest框架 - 集成chumi示例](https://github.com/chumijs/chumi-nest)

5. [🎨 Next.js框架 - 集成chumi示例](https://github.com/chumijs/chumi-next)

6. 🤟 欢迎提供更多的示例...

## 架构图

![image.png](https://s1.ax1x.com/2023/03/09/ppnJJeA.png)

## Apis

\`\`\`ts
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
\`\`\`
`
      );

      if (process.argv[3] === '--force') {
        await new Promise((resolve) => {
          const run = spawn('npm', ['publish', '--registry', 'https://registry.npmjs.org'], {
            cwd: path.join(__dirname, '..', 'lib'),
            stdio: 'inherit'
          });
          run.on('close', resolve);
        });
      }
    }
  } as Plugin;
}
