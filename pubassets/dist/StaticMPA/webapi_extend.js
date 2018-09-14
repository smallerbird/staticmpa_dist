function SMPA() {
  var _DialogLoading_index=-1
  this.DialogLoading=function(){
      this.DialogLoadingClose();
      _DialogLoading_index= layer.load(1, {
          shade: [0.1,'#fff'] //0.1透明度的白色背景
      });
  }
    this.DialogLoadingClose=function(){
      if (_DialogLoading_index!=-1){
          layer.close(_DialogLoading_index);
      }
    }
    this.alert=function(msg,callbak){
        var index=layer.alert(msg, {
            closeBtn: 0
        }, function(){
            if (typeof callbak!='undefined') callbak();
            layer.close(index);
        });
    }
    this.confirm=function(msg,callbak,btn){
      var options={};
      if (typeof btn!='undefined'){
          options.btn=['是','否']
      }
      if (typeof callbak!='undefined'){
          callbak=function (isOk) {
          }
      }
        var index=layer.confirm(msg, options, function(){
            callbak(true);
            layer.close(index);
         }, function(){
            callbak(false);
            layer.close(index);
        })
    }
    var cookie_key_auth='StaticMPA_auth12313';
    this.saveAuth=function (auth) {
        $.cookie(cookie_key_auth,auth,{expires:1});
    }
    this.getAuth=function(){
      return $.cookie(cookie_key_auth);
    }

}
window.SMPA=new SMPA();



