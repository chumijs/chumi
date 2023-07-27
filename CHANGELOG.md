# 更新日志 · 测试覆盖率100% [![coverage](https://img.shields.io/codecov/c/github/chumijs/chumi/master.svg)](https://app.codecov.io/gh/chumijs/chumi/tree/master) · 功能稳定保障

## 1.1.11

* 支持通过`loadService`和`loadController`，实现星链模型
  
  可以依次链式加载`controller1`、`service1`、`controller2`、`service2`、`service3`、`controller3` 等等

  实现了任意扩展，让开发者自由搭配，更好了助力bff业务的处理

* 完成了并发测试，保证了`chumi`的健壮性


## 1.1.10

* 支持通过`loadController`，加载其他控制器实例，可以直接调用该控制器上的函数，具体可以查看测试用例代码 `test/fixtures/chain-controllers`

  支持链式调用，即 控制器1 -> 控制器2 -> 控制器3 -> service1 -> service2

  这样做，可以保证ctx上下文的统一，同时也支持目标函数的中间件的处理逻辑

  例如：有两个控制器，对应的地址为 `/api1/1`(函数1) `/api2/2`(函数2)

  这两个接口都可以正常调用，那如果需要做bff，我就可以这样做，创建一个函数3，`/api3/3`

  函数3内部逻辑如下
  ```js
  @Controller()
  export default class {
    控制器1 = loadController(控制器1)
    控制器2 = loadController(控制器2)

    @Get("/api3/2")
    async index(){
      // `/api1/1`(函数1)
      const r1 = await this.控制器1.函数1()

      // `/api2/2`(函数2)
      const r2 = await this.控制器2.函数2()

      // 处理一些聚合的逻辑即可
      return {
        r1, r2
      }
    }
  }
  ```

## 1.1.9

* 通过`loadService`加载的`service`支持链式调用，具体可以查看测试用例代码 `test/fixtures/chain-services`
  
## 1.1.8

* 新增全局的控制器中间件controllerMiddlewares
* 新增在相同的路由前缀下，提供统一的中间件
* 中间件执行顺序如下，结合 `1.1.7`版本一起看

  ```
  chumi中间件middlewares -> chumi控制器全局中间件controllerMiddlewares -> chumi全局路由前缀指定的中间件 
  -> 单个控制器指定的中间件 -> 控制器函数
  ```

  ```js
  // 具体可以查看单元测试用例 test/middleware.test.ts
  app.use(
    chumi<Koa.Context>(
     {
      '/home': [Home],
      '/detail2': {
        controllers: [Detail]
      },
      '/detail': {
        controllers: [Detail],
        // chumi全局路由前缀指定的中间件 
        middlewares: [
          async (ctx, next) => {
            ctx.name = 'detail';
            await next();
          }
        ]
      }
    },
    {
      // chumi控制器全局中间件controllerMiddlewares
      controllerMiddlewares: [
        async (ctx, next) => {
          await next();
          ctx.body = { ret: 0, data: ctx.body };
        }
      ]
    }
   )
  );
  ```

## 1.1.7

* 扩展chumi的第二个参数，支持传入middlewares数组，统一控制chumi里面的所有控制器
  ```
  chumi中间件 -> 控制器中间件 -> 控制器函数
  ```
  ```js
  app.use(
    chumi(
    {
      '/api': [Sample1]
    },
    {
     swagger: {},
     // chumi中间件middlewares
     middlewares: [
      async (ctx, next) => {
        ctx.abc = 1;
        await next();
        expect(ctx.abc).toBe(2);
      },
      async (ctx, next) => {
        ctx.abc = ctx.abc + 1;
        await next();
        expect(ctx.abc).toBe(2);
      }
     ]
    }
   )
  );
  ```

## 1.1.6

* 升级`swagger-ui-dist`版本到`4.18.1`

## 1.1.4

* 扩展chumi的第一个参数，支持全局按需配置不同控制器的路由前缀
  ```js
  app.use(
    chumi(
      {
        // 地址为 /test/api1/xxx
        '/api1': [Sample1],
        // 地址为 /test/api2/xxx
        '/api2': [Sample1]
      },
      { prefix: '/test', swagger: {} }
    )
  );
	```