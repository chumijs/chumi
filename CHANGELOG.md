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