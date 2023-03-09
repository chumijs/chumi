import { Context } from 'koa';
import fs from 'fs';
import path from 'path';
import { getAbsoluteFSPath } from 'swagger-ui-dist';

import { parameterMap, SwaggerOptions } from './constants';
import ChumiRouter from './ChumiRouter';

const defaultOptions: SwaggerOptions = {
  swaggerPath: '/swagger-ui',
  title: 'My Project',
  description: 'This is a swagger-ui for chumi',
  version: '1.0.0',
  tags: []
};

const parametersInMap: { [key in parameterMap['type']]: string } = {
  param: 'path',
  header: 'header',
  query: 'query',
  body: 'body'
};

export default class Swagger {
  private swaggerUiAssetPath: string;
  private options: SwaggerOptions;
  private chumiRouter: InstanceType<typeof ChumiRouter>;

  constructor(options: SwaggerOptions, chumiRouter: InstanceType<typeof ChumiRouter>) {
    this.swaggerUiAssetPath = getAbsoluteFSPath();
    this.options = Object.assign(defaultOptions, options);
    this.chumiRouter = chumiRouter;
    console.log(`[swagger-ui] http://localhost:{port}${this.options.swaggerPath}/index.html`);
  }

  replaceInfo(content: string) {
    const str = `location.href.replace('${this.options.swaggerPath}/index.html', '${this.options.swaggerPath}/index.json'),\n validatorUrl: null,`;
    return content.replace('"https://petstore.swagger.io/v2/swagger.json",', str);
  }

  async run(ctx: Context) {
    const pathname = ctx.path;
    if (!this.swaggerUiAssetPath || pathname.indexOf(this.options.swaggerPath) === -1) {
      return false;
    }
    const arr = pathname.split('/');
    let lastName = arr.pop();
    if (lastName === 'index.json') {
      /**
       * 整理swagger json
       */
      const routeRules = this.chumiRouter.getRouteRules();
      const tags = {};

      this.options.tags.forEach((tag) => {
        tags[tag.name] = tag;
      });

      const paths = {};
      routeRules.forEach((item) => {
        const { path, method, parameterMap } = item;
        const parameters = [];
        parameterMap.forEach((parameter) => {
          const swaggerParameter: any = {
            name: parameter.property,
            in: parametersInMap[parameter.type]
          };
          if (parameter.dataType) {
            swaggerParameter.schema = {
              type: parameter.dataType.name.toLocaleLowerCase()
            };
          }
          parameters.push(swaggerParameter);
        });
        const swaggerPath = path
          .split('/')
          .map((item) => {
            if (/^:/.test(item)) {
              return `{${item.replace(/^:/, '')}}`;
            }
            return item;
          })
          .join('/');

        item.tags.forEach((tag) => {
          if (!tags[tag]) {
            tags[tag] = {
              name: tag
            };
          }
        });

        const methodOptions: any = { parameters, tags: item.tags };

        if (item.routeOptions.summary) {
          methodOptions.summary = item.routeOptions.summary;
        }

        if (!paths[swaggerPath]) {
          paths[swaggerPath] = {};
        }
        paths[swaggerPath][method.toLocaleLowerCase()] = methodOptions;
      });

      ctx.body = {
        openapi: '3.0.1',
        info: {
          title: this.options.title,
          description: this.options.description,
          version: this.options.version,
          contact: {}
        },
        tags: Object.values(tags),
        paths
      };
      return true;
    }
    if (!lastName) {
      lastName = 'index.html';
    }
    let content: any = fs.readFileSync(path.join(this.swaggerUiAssetPath, lastName));
    if (lastName === 'index.html' || lastName === 'swagger-initializer.js') {
      content = content.toString('utf8');
      content = this.replaceInfo(content);
    }
    const ext = path.extname(lastName);
    if (ext === '.js') {
      ctx.set('content-type', 'application/javascript');
    } else if (ext === '.map') {
      ctx.set('content-type', 'application/json');
    } else if (ext === '.css') {
      ctx.set('content-type', 'text/css');
    } else if (ext === '.png') {
      ctx.set('content-type', 'image/png');
    }
    ctx.body = content;
    return true;
  }
}
