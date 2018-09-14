/**
 * 这是一个全局类，所有方法都附属在window对象上
 * @module lib.web.utils
 * @class windowGlobal
 */
//让IE兼容console
if(!window.console){
    window._console = window.console;//将原始console对象缓存
    window.console = (function (orgConsole) {
        return {//构造的新console对象
            log: getConsoleFn("log"),
            debug: getConsoleFn("debug"),
            info: getConsoleFn("info"),
            warn: getConsoleFn("warn"),
            exception: getConsoleFn("exception"),
            assert: getConsoleFn("assert"),
            dir: getConsoleFn("dir"),
            dirxml: getConsoleFn("dirxml"),
            trace: getConsoleFn("trace"),
            group: getConsoleFn("group"),
            groupCollapsed: getConsoleFn("groupCollapsed"),
            groupEnd: getConsoleFn("groupEnd"),
            profile: getConsoleFn("profile"),
            profileEnd: getConsoleFn("profileEnd"),
            count: getConsoleFn("count"),
            clear: getConsoleFn("clear"),
            time: getConsoleFn("time"),
            timeEnd: getConsoleFn("timeEnd"),
            timeStamp: getConsoleFn("timeStamp"),
            table: getConsoleFn("table"),
            error: getConsoleFn("error"),
            memory: getConsoleFn("memory"),
            markTimeline: getConsoleFn("markTimeline"),
            timeline: getConsoleFn("timeline"),
            timelineEnd: getConsoleFn("timelineEnd")
        };
        function getConsoleFn(name) {
            return function actionConsole() {
                if (typeof (orgConsole) !== "object") return;
                if (typeof (orgConsole[name]) !== "function") return;//判断原始console对象中是否含有此方法，若没有则直接返回
                return orgConsole[name].apply(orgConsole, Array.prototype.slice.call(arguments));//调用原始函数
            };
        }
    }(window._console));
}
String.prototype.trim=function(){
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
String.prototype.ltrim=function(){
    return this.replace(/(^\s*)/g,"");
}
String.prototype.rtrim=function(){
    return this.replace(/(\s*$)/g,"");
}
/**
 * 时间戳 转换格式：
 * 	new Date(时间戳).format('yyyy/MM/dd');//年/月/日
 * 	new Date(时间戳).format('yyyy-MM-dd hh:mm:ss');//年-月-日 时:分:秒
 * @param format
 * @returns {*}
 */
Date.prototype.format = function(format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
}
//UrlEncode
window.str2asc=function(strstr){
    return ("0"+strstr.charCodeAt(0).toString(16)).slice(-2);
}
window.asc2str=function(ascasc){
    return String.fromCharCode(ascasc);
}
window.UrlEncode=function(str,isEncodeURI){
    if (typeof isEncodeURI=='undefined') isEncodeURI=true;
    if(str=='') return '';
    if(isEncodeURI) str=encodeURI(str)
    var ret="";
    var strSpecial="!\"#$%&'()*+,/:;<=>?[]^`{|}~%";
    var tt= "";

    for(var i=0;i<str.length;i++){
        var chr = str.charAt(i);
        var c=str2asc(chr);
        tt += chr+":"+c+"n";
        if(parseInt("0x"+c) > 0x7f){
            ret+="%"+c.slice(0,2)+"%"+c.slice(-2);
        }else{
            if(chr==" ")
                ret+="+";
            else if(strSpecial.indexOf(chr)!=-1)
                ret+="%"+c.toString(16);
            else
                ret+=chr;
        }
    }
    return ret;
}
window.UrlDecode=function(str,isDecodeURI){
    if (typeof decodeURI!='undefined') return decodeURI(str);

    if (typeof isDecodeURI=='undefined') isDecodeURI=true;
    if(!str) return '';
    if(str=='') return '';
    var ret="";
    for(var i=0;i<str.length;i++){
        var chr = str.charAt(i);
        if(chr == "+"){
            ret+=" ";
        }else if(chr=="%"){
            var asc = str.substring(i+1,i+3);
            if(parseInt("0x"+asc)>0x7f){
                ret+=asc2str(parseInt("0x"+asc+str.substring(i+4,i+6)));
                i+=5;
            }else{
                ret+=asc2str(parseInt("0x"+asc));
                i+=2;
            }
        }else{
            ret+= chr;
        }
    }
    if(isDecodeURI){
        if (typeof decodeURI!='undefined') ret=decodeURI(ret);
    }
    return ret;
}

/**
 * 停止事件冒泡
 * @param e
 */
window.e_stopPropagation=function(e){
    var isOk=false;
    try{
        //如果提供了事件对象，则这是一个非IE浏览器
        if ( e && e.stopPropagation ) {
//因此它支持W3C的stopPropagation()方法
            e.stopPropagation();
        }else {
//否则，我们需要使用IE的方式来取消事件冒泡
            window.event &&(window.event.cancelBubble = true);
        }
        isOk=true;
    }catch(e){
        isOk=false;
        console.log('window.e_stopPropagation error',JSON.stringify(e));
    }
    return isOk;
}
/**
 * 阻止默认浏览器动作
 * @param e
 * @returns {boolean}
 */
window.e_preventDefault=function(e){
    var isOk=false;
    try{
        if ( e && e.preventDefault ) {
            //阻止默认浏览器动作(W3C)
            e.preventDefault();
        }else {
            //IE中阻止函数器默认动作的方式
            window.event &&(window.event.returnValue = false);
        }
        isOk=true;
    }catch(e){
        isOk=false;
        console.log('window.e_preventDefault error',JSON.stringify(e));
    }
    return isOk;
}
//获得当前浏览器的信息
/*
 window.BROWSER.versions.trident//IE内核
 window.BROWSER.versions.presto//opera内核
 window.BROWSER.versions.webKit//苹果、谷歌内核
 window.BROWSER.versions.gecko//火狐内核
 window.BROWSER.versions.mobile//是否为移动终端
 window.BROWSER.versions.ios//ios终端
 window.BROWSER.versions.android//android终端或者uc浏览器
 window.BROWSER.versions.iPhone//是否为iPhone或者QQHD浏览器
 window.BROWSER.versions.iPad//是否iPad
 window.BROWSER.versions.webApp//是否web应该程序，没有头部与底部
 */
window.BROWSER = {
    versions: function () {
        var u = navigator.userAgent, app = navigator.appVersion;
        return {//移动终端浏览器版本信息
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
        };
    } (),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
};
//获得ie的版本号
window.BROWSER_IE_versions= function () {
    var UA = navigator.userAgent,
        isIE = UA.indexOf('MSIE') > -1,
        v = isIE ? /\d+/.exec(UA.split(';')[1]) :-1;
    return v;
}
/**
 * 获取地址栏里的参数
 * @returns {*}
 */
window.getRequest=function(url) {
    if (typeof url=='undefined') url = location.search; //获取url中"?"符后的字串
    var arr=url.split('?');
    var theRequest ={};
    //console.log('getRequest:',url, arr)
    if (arr.length>=2){
        var strs=arr[1].split("&");
        if(strs.length>0){
            for (var i = 0; i < strs.length; i++) {
                var temItem=strs[i].split("=");
                theRequest[temItem[0]] = (temItem[1]);
            }
        }
    }
    return theRequest;
}
/**
 * 转数字
 * @param num
 * @returns {*}
 */
window.toNumber=function(num){
    num=Number(num);
    if(isNaN(num)){
        return 0;
    }
    return num;
}
Number.prototype.toFixed = function(fractionDigits)
{
    //没有对fractionDigits做任何处理，假设它是合法输入
    return (parseInt(this * Math.pow( 10, fractionDigits  ) + 0.5)/Math.pow(10,fractionDigits)).toString();
}
window.toFloat=function(s, n){
    if (typeof s=='undefined') s = 0;
    if (typeof n=='undefined') n = 3;
    //console.log('window.toFloat:',(s + "").replace(/[^\d\.-]/g, ""),parseFloat((s + "").replace(/[^\d\.-]/g, "")));
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n);
    return s;
}
window.toThousands=function(val,n) {
    if (typeof val=='undefined') val = 0;
    if (typeof n=='undefined') n = 3;
    if(isNaN(val)){
        return '';
    }

    val=window.toFloat(val||0);
    //console.log('window.toThousands:',val)
    var numArr = (val||0).toString().split('.');
    numArr[0] = numArr[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    return numArr.join('.');
};
//解决IE10以下不支持Function.bind
if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
        if (typeof this !== "function") {
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }
        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function() {},
            fBound = function() {
                return fToBind.apply(this instanceof fNOP && oThis ? this : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };
        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();
        return fBound;
    };
}
window.WebAPI.setHost('http://localhost:3000/');
window.WebAPI.setAuthKey('sessionKey');
/*如果cookies里有保存，就设置回token*/
var login_auth=window.SMPA.getAuth()
if (login_auth!=''){
    window.WebAPI.setAuth(login_auth);
}
//拦截401,403
window.WebAPI.setCallbackStepStatus(function (msg,data) {
    //console.log('callbackStepStatus:',msg, data)
    if (msg==window.WebAPI.WebAPI_MSG_SUCESS&&data == "401"){
        window.SMPA.alert('收到401,你没有权限，[重写web/assets/public.js],加入自己的逻辑')
    }else if (msg==window.WebAPI.WebAPI_MSG_SUCESS&&data == "403"){
        window.SMPA.alert('收到403,你没有权限，[重写web/assets/public.js],加入自己的逻辑')
    }
});
//对返回的权限常量进行class名字转换
function UserPermissions(){
    var _permissions=[],jqueryS='';
    /*
    [
        {
            "id": 1,
            "permissionsName": "系统管理",
            "element": "sys:-"
        },
        {
            "id": 2,
            "permissionsName": "用户管理",
            "element": "sys:userList"
        }
    ]

    */
    this.setValue=function(data,isRun){
        var _permissions=data;
        jqueryS='';
        for (var i=0;i<_permissions.length;i++){
            var item=_permissions[i];
            var element=item.element;
            if (jqueryS!='') jqueryS+=',';
            jqueryS+='[data-permissions="'+element+'"]'
        }
        if (!!isRun==true) this.run();
    }
    this.run=function(){
        console.log('run '+jqueryS)
        $(jqueryS).show();
    }
}
window.WebAPI.permissions=new UserPermissions();
/**
 * 渲染模板
 * 文档地址：Github：https://github.com/jojoin/tppl
 * 注：在data加入了一些公共注入的变量：
 * WEB_STATIC_URL 静态资源的根目录url
 * SITE_HOST 网站的根目录url
 * @param tpl 模板文件
 * @param data 渲染数据
 * @returns {fn}
 */
window.renderTemplete= function(tpl, data){
    //注入一些公共变量
    /*if(!data.WEB_STATIC_URL) if(window.WEB_STATIC_URL) data.WEB_STATIC_URL=window.WEB_STATIC_URL;
    if(!data.SITE_HOST) if(window.SITE_HOST) data.SITE_HOST=window.SITE_HOST;
    if(!data.LESS_CP) if(window.LESS_CP) data.LESS_CP=window.LESS_CP;
    if(!data.DEFAULT_IMG) if(window.DEFAULT_IMG) data.DEFAULT_IMG=window.WEB_STATIC_URL+window.DEFAULT_IMG;*/
    //
    try {
        var fn =  function(d) {
            var i, k = [], v = [];
            for (i in d) {
                k.push(i);
                v.push(d[i]);
            };
            return (new Function(k, fn.$)).apply(d, v);
        };
        if(!fn.$){
            var tpls = tpl.split('[:');
            fn.$ = "var $=''";
            for(var t = 0;t < tpls.length;t++){
                var p = tpls[t].split(':]');
                if(t!=0){
                    fn.$ += '='==p[0].charAt(0)
                        ? "+("+p[0].substr(1)+")"
                        : ";"+p[0].replace(/\r\n/g, '')+"$=$"
                }
                // 支持 <pre> 和 [::] 包裹的 js 代码
                fn.$ += "+'"+p[p.length-1].replace(/\'/g,"\\'").replace(/\r\n/g, '\\n').replace(/\n/g, '\\n').replace(/\r/g, '\\n')+"'";
            }
            fn.$ += ";return $;";
            // log(fn.$);
        }
        var outStr=data ? fn(data) : fn;
        return outStr
    }catch (e){
        console.log('window.renderTempvare error:'+e);
        console.log('error tpl:',tpl);
    }
}
