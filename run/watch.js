const watchJsCss=require('../watchJsCss.js')
const Path=require('path')
let {formatArguments}=require('../CommandLine.js')
//
const c_arguments=process.argv.splice(2)
let configfile=formatArguments('config',c_arguments);
if (/\.config.js/.test(configfile)){
    console.error('不用输入.config.js')
    return;
}
let isless=formatArguments('less',c_arguments)||true;
let jsjs=formatArguments('js',c_arguments)||true;
const prefix='../../../';
configfile=prefix+'config/'+configfile+'.config.js'
let config=require(configfile);
let buildConfig=config.build;
let devConfig=config.dev;
let {beautifierPath,beautifierChangeCallback}=buildConfig;
let {rootPath}=devConfig;
beautifierPath=Path.resolve(rootPath,'./'+beautifierPath);
console.log('开始监听：'+beautifierPath)
watchJsCss(beautifierPath,isless,jsjs,buildConfig,config,beautifierChangeCallback);