import { SymbolGet, SymbolPost, SymbolDelete, SymbolPut, RouteOptions } from './constants';

const handleMethod = (
  routePath: string,
  routeMethod: symbol,
  routeOptions: RouteOptions
): MethodDecorator => {
  return (target, property, descriptor) => {
    const originalFunction = descriptor.value as any;
    originalFunction.routePath = routePath;
    originalFunction.routeMethod = routeMethod;
    originalFunction.routeOptions = routeOptions;
  };
};

export const Get = (routePath: string, routeOptions?: RouteOptions): MethodDecorator => {
  return handleMethod(routePath, SymbolGet, routeOptions);
};

export const Post = (routePath: string, routeOptions?: RouteOptions): MethodDecorator => {
  return handleMethod(routePath, SymbolPost, routeOptions);
};

export const Delete = (routePath: string, routeOptions?: RouteOptions): MethodDecorator => {
  return handleMethod(routePath, SymbolDelete, routeOptions);
};

export const Put = (routePath: string, routeOptions?: RouteOptions): MethodDecorator => {
  return handleMethod(routePath, SymbolPut, routeOptions);
};
