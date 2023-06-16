# 1.1.5

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