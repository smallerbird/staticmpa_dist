//NodeJS收发GET和POST请求 - gamedaybyday - 博客园 https://www.cnblogs.com/gamedaybyday/p/6637933.html
//http://tool.oschina.net/commons
const http = require('http'); 　//实例化“http”
const URL = require('url'); 　//实例化“http”
const querystring = require('querystring');
const path=require('path')
const ejs=require('ejs');
let {exists,readFile}=require('./FSTools')
const readEjsFile = function (file,data={}){
    console.log('readEjsFile:'+file)
    return new Promise(function (resolve, reject){
        let options={};
        data.I = function (include,file,data={}) {
            return include(file,data);
        }
        ejs.renderFile(file, data, options, function(err, data){
            if (err) reject(err);
            resolve(data);
        });
    });
};
function resStatusCode({res,code='200',content='',header=null}){
    res.statusCode = code;
    if (!header) header={"Content-Type":"text/plain"}

    for (var key in header){
        res.setHeader(key,header[key]);
    }
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.setHeader("X-Powered-By",' 3.2.1');
    res.end(content);
}

function resJosn({res,resultCode=0,resultMsg="success",data={}}) {
    let content=JSON.stringify({resultCode,resultMsg,data})
    let header={"Content-Type":"application/json"}
    resStatusCode({res,content,header})
}
function start({rootPath,port=3000,hostname='127.0.0.1'}){
    console.log('rootPath:'+rootPath)
    var server = new http.Server();
    //server.on('request',async (req,res)=>{
    server = http.createServer(async(req, res) => {
        var reqUrl=req.url;
        var urlInfo=URL.parse(reqUrl, true);
        var params = urlInfo.query;
        var pathname=urlInfo.pathname;
        var method=req.method;

        if(reqUrl=='/'){
            reqUrl='/index.html';
            pathname=reqUrl;
        }
        /*if(/^\/lib\//.test(reqUrl)){
            console.log('lib/');
        }*/
        console.log(`url:[${method}] ${reqUrl} params:${JSON.stringify(params)} pathname${pathname}`)
        var serverReqInfo={
            method,
            reqUrl,
            params:JSON.stringify(params),
            pathname
        }
        if (pathname=='/favicon.ico'){
            resStatusCode({res,code:404})
            return;
        }
//手动添加一些模拟接口
        //网站目录apidata里的文件，对应地址：/testapi_ + 文件名
        let key_apidata='/testapi_';
        if (pathname.indexOf(key_apidata)!=-1){
            var readfilepath=path.resolve(rootPath,'./apidata/'+pathname.split(key_apidata)[1]);
            if (!/\.js$/.test(readfilepath)) readfilepath+='.js'
            console.log('寻找文件：接口定义文件:'+readfilepath)
            var isE=await exists(readfilepath)
            if (isE){
                var op=require(readfilepath);
                if (typeof op=='function'){
                    let urlInfo=URL.parse(req.url, true);
                    let query=urlInfo.query
                    op=op(req,query,urlInfo);
                }
                var code=op.code;
                let data=op.data
                if (code!=200){ //serverReqInfo
                    return resStatusCode({res,code:401,content:data});
                }else{
                    return resJosn({res,data});
                }
            }else{
                return resStatusCode({res,code:401});
            }
        }
        console.log('pathname:'+pathname)
        if (pathname.indexOf('.html')!=-1||
            pathname.indexOf('.js')!=-1||
            pathname.indexOf('.css')!=-1||
            pathname.indexOf('.jpg')!=-1||
            pathname.indexOf('.png')!=-1||
            pathname.indexOf('.gif')!=-1||
            pathname.indexOf('.swf')!=-1||
            pathname.indexOf('.eot')!=-1||
            pathname.indexOf('.svg')!=-1||
            pathname.indexOf('.ttf')!=-1||
            pathname.indexOf('.woff')!=-1
    ){
            var readfilepath;
            let key_apidata='/assets/lib/general';
            if (pathname.indexOf(key_apidata)!=-1){
                readfilepath=path.resolve(__dirname,'./pubassets/dist/'+pathname.split(key_apidata)[1])
            }else{
                readfilepath=path.resolve(rootPath,'./'+pathname)
            }
            console.log('读取:'+readfilepath)
            let getFile=null;
            if (pathname.indexOf('.html')!=-1){
                getFile=readEjsFile;
            }else{
                getFile=readFile;
            }
            let isE=await exists(readfilepath)
            console.log('是否在存:'+isE+' '+readfilepath)
            if (!isE){
                return resStatusCode({res,code:404});
            }
            let data=await getFile(readfilepath);//.then(function (data) {
                var content=data;
                var header
                //Content-Type: text/css
                if (pathname.indexOf('.jpg')!=-1||
                    pathname.indexOf('.png')!=-1||
                    pathname.indexOf('.gif')!=-1
                ){
                    header={"Content-Type":"image/jpeg"}
                }else if (pathname.indexOf('.css')!=-1){
                    header={"Content-Type":"text/css"}
                }else if (pathname.indexOf('.js')!=-1){
                    header={"Content-Type":"text/javascript; charset=UTF-8"}
                }else{
                    //console.log('content:',content);
                    header={"Content-Type":"text/html; charset=utf8"}
                }
                resStatusCode({res,code:200,content,header})
            //},function(error){console.log(error);resStatusCode({res,code:500})});
            return;
        }else{
            if (method=='GET') return resStatusCode({res,code:404})
        }
        var body = "";
        req.on('data', function (chunk) {
            body += chunk;  //一定要使用+=，如果body=chunk，因为请求favicon.ico，body会等于{}
            //console.log("chunk:",chunk);
        });
//在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
        req.on('end', function () {
            // 解析参数
            body = querystring.parse(body);  //将一个字符串反序列化为一个对象
            //console.log("body:",body);





        });

    });
    server.listen(port, hostname, () => {　　//实现监听
        console.log(`Server running at http://${hostname}:${port}/`);
    });
}

module.exports=start