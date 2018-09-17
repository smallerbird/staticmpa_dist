 staticmpa.js
=================
特征
-----
兼容IE8的前端多页,前后端分离的解决方案。

特征
-----
1. 兼容IE8
2. 前端关键词:Jquery,require.js,less,ES6,ejs
3. 会jquery,js就会用

组成部分：
-----
1. 本地调试服务器包括
    
    1.1 用于调试访问的http服务器 
    
    1.2 自动监测转换less和js的程序
    
2. 发布工具


开始一个项目：
-----
1 . 从一个已有的项目开始
 
 > git clone下来,地址：git@github.com:smallerbird/bangbang.js.git
 
    ```sh
    git clone git@github.com:smallerbird/staticmpa_demo.git
    ```
    
2 . 安装依赖

```sh
cd staticmpa_demo
npm i git://github.com:smallerbird/bangbang.js.git -g
npm i
```

3 . 启动

```sh
#启动本地http服务器
npm run start_demo   #然后打开浏览器访问：http://localhost:3001
#启动自动监测编译less,js代码
npm run watch_demo
```

4 . 发布

```sh
npm run build_demo
#根目录会出现build文件夹
```

目录介绍
-----

```sh
├─bangbang #bangbang.js 脚本配置文件
├─config #网站配置文件
├─demo #demo项目源文件,注：访问地址是以这个根目录访问的
│  ├─apidata #模拟的api放在这里
│  ├─assets
│  │  ├─component #自定义前端组件
│  │  │  ├─xxx
│  │  ├─demo #测试例子页面的js,css和图片
│  │  │  ├─xxxx
│  │  └─pages 
│  │      └─templete
│  ├─demo #测试例子页面的html
│  ├─pages #页面的html
│  └─pub #html页面公共头部
```

例子清单
-----
1. api请求测试
2. ie8+测试杂项
3. 调试面板(主要用于ie8调试)
4. 弹框
5. 下拉框
6. 不同权限显示不同元素
7. 多语言


网站配置文件
-----
> 关于网站配置文件的详细说明可以参看源代码的注释，位置：config/demo.config.js

本地调试服务器
-----
1. 服务器访问配置

    服务器访问的根目录是项目的根目录，例如：demo访问http://localhost:3001 对应的文件目录为：demo/,关于目录名，地址，端口号在config/demo.config.js中配置(大概在56~58行)

> 不同站点的配置文件放在：config/  注:命令规范:"站点名称.config.js"
2. 自定义API模拟接口

模拟接口文件统一放在：demo/apidata中:访问地址：http://localhost:3000/testapi_文件名
```js
//文件名 hi.js
let code=200; //服务器返回状态码
let data={msg:'hi node.js'}; //返回的数据
module.exports={code,data}
```
  然后在地址栏访问http://localhost:3000/testapi_hi  就会返回：
  ```js
  {"resultCode":0,"resultMsg":"success","data":"{\"msg\":\"hi node.js\"}"}
  ```
  
3. 关于：http://localhost:3000/lib/general映射的文件目录为：node_modules/staticmpa/pubassets/dist


一个页面的组成
-----
1 . 静态网页

所有静态网页都采用ejs编译，方便把一些公共页面放入demo/pub中，其它页面引用
```html
#例如：demo/demo/templete.html
#引用公共头文件
<%-include("../pub/header_start.html")%>
#设置网页title
<title>templete</title>
#设置网页公共头部结束
<%-include("../pub/header_end.html")%>
#设置网页公共页面头部开始
<%-include("../pub/body_start.html")%>
<div id="templete-container" style="display: none;">
<h4>templete.......</h4>
</div>
#设置网页公共引用js
<%-include("../pub/pubJS_part.html")%>
#当前页面用到的js
<script type="text/javascript" src="/assets/demo/templete/js.min.js"></script>
#设置网页公共页面尾部结束
<%-include("../pub/body_end.html")%>
```

2 . JS文件

2.1 命令规范

统一放在assets下,目录结构与html页面对应，例如:页面demo/demo/templete.html 它的js文件目录结构应该是：demo/assets/demo/templete/js.js

2.2 书写规范

JS采用AMD方式管理模块,起始代码如下：
```js

require([
    'css!demo/templete/css.min',
    'component/DebugInfoPad/js.min',
    'component/fc_select/js.min'
    ],(a1,DebugInfoPad,fc_select)=>{
    $('#templete-container').show();
    console.log('show div #templete-container');
    
    //具体代码写在这里
    new DebugInfoPad();
    new fc_select();
    
});

```
> css!demo/templete/css.min 这种写法，可以动态插入css文件
> a1的作用，只是起到函数参数占位的作用。因为好边的DebugInfoPad,fc_select需要内部使用
> 更详细的模块应用请参看：http://localhost:3001/demo/fc_select.html

2.3 合并文件

一个页面会引用很多公共js文件，考虑到请求优化，需要把一个公共的js文件合并成一个独立的文件，合并文件使用的bangbang脚本，它的配置文件在：bangbang/merge.demo.bangbang.js 可以自行调整。最终会生成一个外部引用的js文件(/assets/lib/general/layer/merge.js)
```sh
#手动触发合并动作
cd bangbang
npm run merge
```

> 注：合并文件动作，不需要手动执行，监控脚本会自动触发。

3 . CSS文件

3.1 命令规范

3.1.1 统一放在assets下,目录结构与html页面对应，例如:页面demo/demo/templete.html 它的js文件目录结构应该是：demo/assets/demo/templete/css.less
3.1.1 css统一用less文件编写,页面中每一大块样式需要，“包裹式的编写”
```html
<div id="container">
    <div id="logo">logo</div>
    <ul class="nav">
        <li>n1</li>
        <li>n2</li>
        <li>n3</li>
    </ul>
</div>
```
```js
#container{
    #logo{
        
    }
    .nav{
        li{
            
        }
    }
}
```
3.2 less的import的使用

less转换器也支持ejs，所以在less中可以使用ejs语法。具体可以参考：demo/assets/demo/fc_select/css.less


其它说明
-----
1. 关于demo/assets/public.js

    1.1 public.js第一行代码有：配置api请求host地址及cookie的key值

    1.2 public.js最后部分：require.js配置文件在


参考
-----
1.[EJS](https://ejs.bootcss.com/)

2.[NODE API](http://nodejs.cn/api/)

3.[fs-extra](https://github.com/jprichardson/node-fs-extra)

3.[requirejs](http://www.requirejs.cn/)



