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