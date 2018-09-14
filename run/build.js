const build=require('../build')
const Path=require('path')

let {formatArguments}=require('../CommandLine.js')
//
//console.log(process.argv);
const c_arguments=process.argv.splice(2)
let configfile=formatArguments('config',c_arguments);
if (/\.config.js/.test(configfile)){
    console.error('输入不用加 .config.js')
    return;
}
const prefix='../../../';
configfile=configfile.split(',');
for (let i=0;i<configfile.length;i++){
    let tem=prefix+'config/'+configfile[i]+'.config.js'
    let config=require(tem);
    let buildConfig=config.build;
    let devConfig=config.dev;
    let {rootPath}=devConfig
    let {copyPaths,beautifierPath,ejsPaths,buildPath}=buildConfig;
    build({copyPaths,ejsPaths,buildPath,rootPath,beautifierPath})
    //console.log(config);
}