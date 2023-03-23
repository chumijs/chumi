import {
  SymbolGet,
  SymbolPost,
  SymbolDelete,
  SymbolPut,
  RouteOptions,
  routePath,
  MethodAction
} from './constants';

const handleMethod = (
  routePath: routePath,
  routeMethod: symbol,
  routeOptions: RouteOptions
): MethodDecorator => {
  return (target, property, descriptor) => {
    // 当前类的函数上，挂载这些字段，用来进行标记
    const originalFunction = descriptor.value as MethodAction;

    // 用来解决当前method action上可以挂载多个method的方案
    if (!originalFunction.routeInfo) {
      originalFunction.routeInfo = [];
    }
    originalFunction.routeInfo.push({
      routePath,
      routeMethod,
      routeOptions
    });
  };
};

/**
 * 需要考虑多个Method注解
 * @Get("/api1")
 * @Get("/api2")
 */

export const Get = (routePath: routePath, routeOptions?: RouteOptions): MethodDecorator => {
  return handleMethod(routePath, SymbolGet, routeOptions);
};

export const Post = (routePath: routePath, routeOptions?: RouteOptions): MethodDecorator => {
  return handleMethod(routePath, SymbolPost, routeOptions);
};

export const Delete = (routePath: routePath, routeOptions?: RouteOptions): MethodDecorator => {
  return handleMethod(routePath, SymbolDelete, routeOptions);
};

export const Put = (routePath: routePath, routeOptions?: RouteOptions): MethodDecorator => {
  return handleMethod(routePath, SymbolPut, routeOptions);
};
