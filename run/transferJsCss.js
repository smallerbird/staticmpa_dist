const Path=require('path')
let {formatArguments}=require('../CommandLine.js')
//
const c_arguments=process.argv.splice(2)
let configfile=formatArguments('config',c_arguments);
let configPrefix=formatArguments('prefix',c_arguments);
if (/\.config.js/.test(configfile)){
    console.error('不用输入.config.js')
    return;
}
let isless=formatArguments('less',c_arguments)||true;
let jsjs=formatArguments('js',c_arguments)||true;
let prefix='../../../';
if (configPrefix){
    prefix=configPrefix
    configfile=prefix+configfile+'.config.js'
}else{
    configfile=prefix+'config/'+configfile+'.config.js'
}
let config=require(configfile);
//console.log('config:',config,configfile)
let buildConfig=config.build;
let devConfig=config.dev;
let {beautifierPath,beautifierChangeCallback}=buildConfig;
let {rootPath}=devConfig;
beautifierPath=Path.resolve(rootPath,'./'+beautifierPath);
function transferJsCss(beautifierPath,config,changeCallback=null) {
    let {transformJS,convertLess}=require('../beautifier');
    let {foreachFile}=require('../FSTools');
    //console.log('beautifierPath:'+beautifierPath,config.build)
    foreachFile(beautifierPath,function ({filePath,fileName}){

        //路径统一转换为/
        filePath= filePath.split(Path.sep).join('/');
        if (typeof config.build.beautifierIgnore!='undefined'){
            let arrI=config.build.beautifierIgnore;
            for (let i=0;i<arrI.length;i++){
                //console.log('忽略比对：'+arrI[i]+' test '+filePath+' :'+arrI[i].test(filePath));
                if (arrI[i].test(filePath)){
                    //console.log('忽略改变处理:'+filePath)
                    return false;
                }
            }
        }
        if (/\.js$/.test(filePath)){
            transformJS(filePath);
        }
        if (/\.less$/.test(filePath)){
            convertLess(filePath);
        }

    });
}
transferJsCss(beautifierPath,config,beautifierChangeCallback);