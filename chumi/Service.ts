import { Context } from 'koa';
import {
  ChumiControllerOptions,
  SymbolController,
  SymbolControllerInstance,
  SymbolControllerName,
  SymbolService,
  SymbolServiceName,
  SymbolServiceUniqueTag
} from './constants';

export default (TargetServiceClass: any): any => {
  const uniqueTag = `##Service_${Math.random()}##`;
  class Service<T> {
    ctx: Context;

    constructor(ctx: Context, options: ChumiControllerOptions<T>) {
      this.ctx = ctx;
      const targetServiceInstance = new TargetServiceClass();
      const allProperties = Object.getOwnPropertyNames(
        Object.getPrototypeOf(targetServiceInstance)
      );

      targetServiceInstance.ctx = ctx;

      const cacheInstances = {};
      /**
       * proxy监听，当使用时，才会动态实例化引用的service实例
       */
      const that = new Proxy(targetServiceInstance, {
        get: function (_target, property) {
          if (cacheInstances[property]) {
            return cacheInstances[property];
          }

          /**
           * 只有调用到当前使用的service，会进行动态实例化
           * 主要针对：当前service实例里面，引用其他service的情况，进行动态实例化
           * 即基于当前上下文，依次递归实例化当前所用到的service
           */
          if (
            typeof targetServiceInstance[property] === 'function' &&
            targetServiceInstance[property][SymbolServiceName] === SymbolService
          ) {
            // console.log('instance test>>>>', property);
            // 每次上下文都需要实例化，动态注入当前的ctx，当前上下文执行重复时，将不需要实例化了
            cacheInstances[property] = new targetServiceInstance[property](ctx, options);
            return cacheInstances[property];
          }

          if (
            typeof targetServiceInstance[property] === 'function' &&
            targetServiceInstance[property][SymbolControllerName] === SymbolController
          ) {
            // 控制器A 调用控制器B，直接单独初始化控制器B即可，当做一个纯的class
            // 但是那个的ctx，就要继承当前传的ctx了，这里相当于把那个控制器当做一个延伸
            // console.log('instance test>>>>', property);

            cacheInstances[property] = new targetServiceInstance[property][
              SymbolControllerInstance
            ](ctx, options);
            return cacheInstances[property];
          }
          return targetServiceInstance[property];
        }
      });

      // 控制器一路初始化完毕
      allProperties.forEach((actionName) => {
        if (actionName !== 'constructor') {
          /**
           * 对其他函数进行重新显式绑定
           */
          that[actionName] = targetServiceInstance[actionName].bind(that);
        }
      });

      return that;
    }
  }

  Service[SymbolServiceName] = SymbolService;
  Service[SymbolServiceUniqueTag] = uniqueTag;

  return Service;
};
