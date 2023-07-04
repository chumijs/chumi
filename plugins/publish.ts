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
            'swagger-ui-dist': '^4.18.1'
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
        fs.readFileSync(path.join(__dirname, '..', 'readme.md'), 'utf-8')
      );
      fs.writeFileSync(
        path.join(__dirname, '..', 'lib', 'CHANGELOG.md'),
        fs.readFileSync(path.join(__dirname, '..', 'CHANGELOG.md'), 'utf-8')
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
