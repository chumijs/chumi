import { Context } from 'koa';
import { SymbolService, SymbolServiceName } from './constants';

export default (TargetServiceClass: any): any => {
  class Service {
    ctx: Context;

    constructor(ctx: Context) {
      this.ctx = ctx;
      const targetServiceInstance = new TargetServiceClass();
      const allProperties = Object.getOwnPropertyNames(
        Object.getPrototypeOf(targetServiceInstance)
      );
      targetServiceInstance.ctx = ctx;

      /**
       * proxy监听，当使用时，才会动态实例化引用的service实例
       */
      const cacheServiceInstances = {};
      Object.assign(
        targetServiceInstance,
        new Proxy(targetServiceInstance, {
          get: function (target, property) {
            /**
             * 只有调用到当前使用的service，会进行动态实例化
             * 主要针对：当前service实例里面，引用其他service的情况，进行动态实例化
             * 即基于当前上下文，依次递归实例化当前所用到的service
             */
            if (
              typeof targetServiceInstance[property] === 'function' &&
              targetServiceInstance[property][SymbolServiceName] === SymbolService
            ) {
              // 每次上下文都需要实例化，动态注入当前的ctx，当前上下文执行重复时，将不需要实例化了
              const serviceInstance = new targetServiceInstance[property](ctx);
              cacheServiceInstances[property] = serviceInstance;
              return serviceInstance;
            }
            return targetServiceInstance[property];
          }
        })
      );

      allProperties.forEach((actionName) => {
        if (actionName !== 'constructor') {
          /**
           * 对其他函数进行重新显式绑定
           */
          Object.assign(this, {
            [actionName]: targetServiceInstance[actionName].bind(targetServiceInstance)
          });
        }
      });
    }
  }

  Service[SymbolServiceName] = SymbolService;

  return Service;
};
