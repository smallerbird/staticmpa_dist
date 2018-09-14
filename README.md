 staticmpa.js
=================

特征
-----
1. 兼容ie8的前端多页应用前后端分离解决方案。
2. 兼容旧的浏览器:现在H5，单页应用很流行，各种脚本构建应用。但在pc网站方面，因为有些项目还是需要兼容旧的浏览器。同时又需要做到前后端分离。所以现在一些先进的前端技术就不好使了。所以在这里整理一个传统的前后端分离代码框架。(之前用webpack做过ie8兼容es6的转化脚本，感觉应用太重了，同时还需要具有前端的一些新的技能人员才可以使用。)
3. 前端技术门槛低：懂点前端技术的后台人员也可以上手。

组成部分：
-----
1. pc网站前后端调用接口的一些方法集成，整理。
2. 本地调试服务器;包括1。用于调试访问的http服务器 2.自动监测转换less和js的程序
3. 发布脚本

如何使用：
-----
1. 第一步：安装server的依赖包
```sh
cd server
npm i
```
2. 第二步：回到项目目录
```sh
cd ..
```
3. 第三步：配置站点 进入config目录下，建立配置文件，注：格式为"站点名称.config.js"
```js
// web.config.js
module.exports={
    build:{
        //生成的目录名 注：是相对build目录为根目录。
        buildPath:'web',
        //复制的目录
        copyPaths:[
            {from:'web/assets',to:'assets'}, //从web/assets 拷贝到 build/web/assets
            {from:'web/lib',to:'lib'},
        ],
        //压缩最小化
        beautifierPath:[
            'assets'  //压缩web/assets
        ],
        //需要编译ejs目录及生成的html的目录
        ejsPaths:[
            {from:'web',to:''}, //从web/ 到  build/web  注：to是以build/web为
            {from:'web/demo',to:'demo'}
        ]
    },
    dev:{
        rootPath:'./web/',
        hostname:'127.0.0.1',
        port:3000
    }
}
```
4. 第三步:启动调试服务器
```sh
node startServer.js --config web
```
5. 第四步:启动自动压缩css,js监听脚本
```sh
node watch.js --config web
```
如何发布
-----
1. 运行下面的脚本，会在项目根目录下生成build文件夹，可以自行把这个文件部署到静态服务器里。
```sh
npm run build --config web
```

2. 自定义发布的细节，可以修改配置文件:confit/web.config.js
```js
// web.config.js
module.exports={
    build:{
        //生成的目录名 注：是相对build目录为根目录。
        buildPath:'web',
        //复制的目录
        copyPaths:[
            {from:'web/assets',to:'assets'}, //从web/assets 拷贝到 build/web/assets
            {from:'web/lib',to:'lib'},
        ],
        //压缩最小化
        beautifierPath:[
            'assets'  //压缩web/assets
        ],
        //需要编译ejs目录及生成的html的目录
        ejsPaths:[
            {from:'web',to:''}, //从web/ 到  build/web  注：to是以build/web为
            {from:'web/demo',to:'demo'}
        ]
    },
    dev:{
        rootPath:'./web/',  //调试服务器:站点所在目录
        hostname:'127.0.0.1', //调试服务器:站点host
        port:3000 //调试服务器:站点端口
    }
}

```

web目录相关说明及规范
-----
1. web目录存放的是所有前端用到的文件
2. web/assets  内放置文件规范
> web/assets根目录下，只放置当前网站的一些公共的css,js
> web/assets/pages下放置具体某个页面的所有前端内容:如:http://localhost/index.html  这个页面目录结构应该是：
```sh
web/assets/pages/index/index.css
web/assets/pages/index/index.js
web/assets/pages/index/images
```
3. web/lib 内放置一些第三放的库.需要注意的是所有jquery相关的放置到jquery目录内。
4. apidata 属于框架保留目录，里面存放了用于自定义调试服务器API.

   例如：需要定义一个接口: http://localhost:3000/testapi_hi,可以在新建一个文件web/apidata/hi.js
```js
let code=200; //服务器返回状态码
let data={msg:'hi node.js'}; //返回的数据
module.exports={code,data}
```
  然后在地址栏访问：就会返回：
  ```js
  {"resultCode":0,"resultMsg":"success","data":"{\"msg\":\"hi node.js\"}"}
  ```
> 注：如果要修改resultCode,resultMsg的名称，需要修改：server/App.js 代码中的定义的resJosn函数部分。

5. web下的html,支持ejs模板。所以页面中的一些公共复用的部分可以通过ejs语法外部引用。 注：当前框架公共部分放在web/pagepub下.

    主要用到引用外部html文件：(下面有两个参数，第一个参数：引用的html相对位置，RelativeRootPathPrefix参数：html内容引用静态资源相对地址)
    ```js
    <%-include("../pagepub/header_start.html",{RelativeRootPathPrefix:'../'})%>
    ```

6. 框架实例部分文件放在：web/demo
7. 不同站点的配置文件放在：config/  注:命令规范:"站点名称.config.js"


开发页面如何访问
-----
1. 访问地址与web根目录的结构是相对应。例如：要访问web/demo/test.html  访问地址：http://localhost:3000/demo/test.html
  
例子介绍
-----  
1. API调用例子  访问地址：http://localhost:3000/demo/test.html
2. 集成登录和token的调用例子  访问地址：  http://localhost:3000/demo/testLogin.html
3. 权限访问例子  访问地址：  http://localhost:3000/demo/permissions.html

参考
-----
1.[EJS](https://ejs.bootcss.com/)

2.[NODE API](http://nodejs.cn/api/)

3.[fs-extra](https://github.com/jprichardson/node-fs-extra)

3.[esl](https://github.com/ecomfe/esl)



