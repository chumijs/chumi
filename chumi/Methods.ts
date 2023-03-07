import { SymbolGet, SymbolPost, SymbolDelete, SymbolPut } from './constants';

const handleMethod = (routePath: string, routeMethod: symbol): MethodDecorator => {
  return (target, property, descriptor) => {
    const originalFunction = descriptor.value as any;
    originalFunction.routePath = routePath;
    originalFunction.routeMethod = routeMethod;
  };
};

export const Get = (routePath: string): MethodDecorator => {
  return handleMethod(routePath, SymbolGet);
};

export const Post = (routePath: string): MethodDecorator => {
  return handleMethod(routePath, SymbolPost);
};

export const Delete = (routePath: string): MethodDecorator => {
  return handleMethod(routePath, SymbolDelete);
};

export const Put = (routePath: string): MethodDecorator => {
  return handleMethod(routePath, SymbolPut);
};
