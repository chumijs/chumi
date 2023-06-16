import { Middleware, Next } from 'koa';

export const SymbolGet = Symbol('get');
export const SymbolPost = Symbol('post');
export const SymbolDelete = Symbol('delete');
export const SymbolPut = Symbol('put');
export const SymbolParameter = Symbol('parameter');
export const ALL = Symbol('all');

export const SymbolRouter = Symbol('chumiRouter');

export const SymbolServiceName = Symbol('serviceName');
export const SymbolService = Symbol('service');
export const SymbolApiTags = Symbol('controller-api-tags');

export type BaseDataType = StringConstructor | NumberConstructor;

export interface parameterMap {
  property: string | symbol;
  parameterIndex: number;
  type: 'query' | 'param' | 'body' | 'header' | 'files';
  dataType: BaseDataType;
}

export function loadService<T extends abstract new (...args: any) => any>(
  value: T
): InstanceType<typeof value> {
  return value as any;
}

export type SwaggerOptions = Partial<{
  swaggerPath: string;
  title: string;
  description: string;
  version: string;
  tags: { name: string; description: string }[];
}>;

export type RouteOptions = Partial<{
  summary: string;
  middleware: Middleware[];
}>;

export interface routeRule {
  method: string;
  path: string;
  parameterMap: parameterMap[];
  routeOptions: RouteOptions;
  tags: string[];
}

export type routePath = string | RegExp;

export type routeRules = routeRule[];

export type middlewares<T> = ((ctx: T, next: Next) => Promise<void>)[];

export interface ChumiControllerOptions<T> {
  prefix?: string;
  data?: Record<string | number, any>;
  middlewares?: middlewares<T>;
}

export type MethodAction = Function & {
  routeInfo: {
    routePath: routePath;
    routeMethod: symbol;
    routeOptions: RouteOptions;
  }[];
};

export type Ctr<T> =
  | Object[]
  | Record<string, { controllers: Object[]; middlewares?: middlewares<T> } | Object[]>;
