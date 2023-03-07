export const SymbolGet = Symbol('get');
export const SymbolPost = Symbol('post');
export const SymbolDelete = Symbol('delete');
export const SymbolPut = Symbol('put');
export const SymbolParameter = Symbol('parameter');
export const ALL = Symbol('all');

export const SymbolRouter = Symbol('chumiRouter');

export const SymbolServiceName = Symbol('serviceName');
export const SymbolService = Symbol('service');

export type BaseDataType = StringConstructor | NumberConstructor;

export interface parameterMap {
  property: string | symbol;
  parameterIndex: number;
  type: 'query' | 'param' | 'body' | 'header';
  dataType: BaseDataType;
}

export function loadService<T extends abstract new (...args: any) => any>(
  value: T
): InstanceType<typeof value> {
  return value as any;
}
