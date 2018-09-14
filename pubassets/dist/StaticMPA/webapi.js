var WebAPI_MSG_START='WebAPI_MSG_START';
var WebAPI_MSG_ERROR='WebAPI_MSG_ERROR';
var WebAPI_MSG_SUCESS='WebAPI_MSG_SUCESS';
//headers={ "Content-type": "application/x-www-form-urlencoded",}
function WebAPI(){
    function error(msg){
        alert('[WebAPI error:]'+msg);
    }
    if (typeof $=='undefined') error('jquery not find!!');
    var _host='',_auth='',_callbackStepStatus_list=[];
    var _authKey='auth';
    function _callbackStepStatus(msg,data){
        try{
            for (var i=0;i<_callbackStepStatus_list.length;i++){
                _callbackStepStatus_list[i](msg,data);
            }
        }catch(e){
            console.log('_callbackStepStatus error:',e)
        }
    }
    function setHost(host){
        _host=host;
    }
    function setAuthKey(key){
        _authKey=key;
    }
    function setAuth(auth){
        _auth=auth;
    }
    function setCallbackStepStatus(callback) {
        _callbackStepStatus_list.push(callback)
    }
    function post(P){
        _callbackStepStatus(WebAPI_MSG_START,'post')
        var defaultParameter={
            url:'',
            body:{},
            host:'',
            method:'post' ,
            params:{},
            auth:'',
            callbackStatusCode:null,
            middlewareHeader:null
        }
        P = $.extend(defaultParameter,P)
        var url=P.url,
            body=P.body,
            host=P.host,
            method=P.method,
            params=P.params,
            auth=P.auth,
            callbackStatusCode=P.callbackStatusCode,
            middlewareHeader=P.middlewareHeader;
        if (host=='') host = _host;
        if (auth=='') auth = _auth;
        var postData = body;
        var querystring='';
        if(!callbackStatusCode) callbackStatusCode=function(code){}
        var keys = [];
        if (params) {
            for (var o in params) {
                var ptype = (typeof params[o]);
                if (ptype == 'number' || ptype == 'string') {
                    keys.push(o + '=' + params[o]);
                }
            }
            querystring=keys.join('&');
        }
        var index=url.indexOf('?')
        var pre='&';
        if(index==-1){
            if(querystring!=''){
                pre='?';
            }else{
                pre='';
            }
        }
        var apiUrl = host+ url+pre + querystring;
        if (auth == '') auth = this.globalAuth;
        var headers = {
            "Content-type": "application/x-www-form-urlencoded",
        }
        if (auth != ''&&auth!='0'||auth!=0) {
            headers[_authKey]=auth;
        }
        if(middlewareHeader) headers=middlewareHeader(headers)
        jQuery.support.cors = true;//兼容ie8,9
        return $.ajax({
            crossDomain: true,//兼容ie8,9
            headers: headers,
            type: method,
            url: apiUrl,
            dataType: "json",
            data: postData,
            statusCode: {
                401: function(r) {
                    _callbackStepStatus(WebAPI_MSG_SUCESS,'401')
                    callbackStatusCode(401);
                },
                403: function(r) {
                    _callbackStepStatus(WebAPI_MSG_SUCESS,'403')
                    callbackStatusCode(403);
                },
                200:function(r){
                    _callbackStepStatus(WebAPI_MSG_SUCESS,'200')
                }
            },
            error:function (xhr) {
                _callbackStepStatus(WebAPI_MSG_ERROR,JSON.stringify(arguments))
            },
            success:function (xhr) {
                _callbackStepStatus(WebAPI_MSG_SUCESS,JSON.stringify(arguments))
            }
        })
    }
    function get(P){
        P.method='GET';
        return post(P);
    }
    function put(P){
        P.method='PUT';
        return post(P);
    }
    this.setHost=setHost;
    this.setCallbackStepStatus=setCallbackStepStatus;
    this.setAuth=setAuth;
    this.setAuthKey=setAuthKey;
    this.get =get;
    this.post=post;
    this.put=put;
}

window.WebAPI=new WebAPI();
window.WebAPI.WebAPI_MSG_START=WebAPI_MSG_START;
window.WebAPI.WebAPI_MSG_ERROR=WebAPI_MSG_ERROR;
window.WebAPI.WebAPI_MSG_SUCESS=WebAPI_MSG_SUCESS;