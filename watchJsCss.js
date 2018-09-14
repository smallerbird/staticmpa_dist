let {minifyJsCurrentPath,minifyCssCurrentPath,transformJS,convertLess}=require('./beautifier');
const fs=require('fs');
const Path=require('path');
var chokidar = require('chokidar');
function startWatch(watchPath,isless,jsjs,watchJsCss,config,changeCallback=null){
    console.log('startWatch:isless:'+isless+',jsjs:'+jsjs+',watchPath:'+watchPath)
    var watcher = chokidar.watch(watchPath, {
        ignored: /(^|[\/\\])\../,
        persistent: true
    });
    watcher.on('change', path =>{
        //路径统一转换为/
        let newPath = path.split(Path.sep).join('/');
        if (typeof watchJsCss.beautifierIgnore!='undefined'){
            let arrI=watchJsCss.beautifierIgnore;
            for (let i=0;i<arrI.length;i++){
                console.log('忽略比对：'+arrI[i]+' test '+newPath+' :'+arrI[i].test(newPath));
                if (arrI[i].test(newPath)){
                    console.log('忽略改变处理:'+path)
                    return false;
                }
            }
        }
        console.log('改变:'+path)
        if (jsjs){
            transformJS(path);
        }
        if (isless){
            convertLess(path);
        }
        if (changeCallback) changeCallback({path,isJS:jsjs,isLess:isless,transformJS,convertLess,config});
        //minifyCssCurrentPath(path)
    })
}
module.exports=startWatch;