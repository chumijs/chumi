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
        const run = spawn(path.join(__dirname, '..', 'node_modules/.bin/tsc'), {
          cwd: path.join(__dirname, '..'),
          stdio: 'inherit'
        });
        run.on('close', resolve);
      });

      fs.removeSync(path.join(__dirname, '..', 'lib', '.tsbuildinfo'));

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
          peerDependencies: {
            koa: '^2.14.1',
            'koa-body': '^5.0.0',
            'koa-compose': '^4.1.0',
            'koa-router': '^10.1.1',
            'swagger-ui-dist': '^4.18.0'
          }
        })
      );

      /**
       * 写入markdown
       */
      fs.writeFileSync(
        path.join(__dirname, '..', 'lib', 'readme.md'),
        `# Chumi · [![NPM version](https://img.shields.io/npm/v/chumi.svg)](https://www.npmjs.com/package/chumi)  · [DOCUMENTATION](https://juejin.cn/post/7208099384071192635)

![image.png](https://s1.ax1x.com/2023/03/07/ppeFpUP.png)

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

      await new Promise((resolve) => {
        const run = spawn('npm', ['publish', '--registry', 'https://registry.npmjs.org'], {
          cwd: path.join(__dirname, '..', 'lib'),
          stdio: 'inherit'
        });
        run.on('close', resolve);
      });
    }
  } as Plugin;
}
