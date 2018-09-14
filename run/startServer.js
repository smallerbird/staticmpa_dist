const App=require('../App')
const Path=require('path')
let {formatArguments}=require('../CommandLine.js')
//
//console.log(process.argv);
const c_arguments=process.argv.splice(2)
let configfile=formatArguments('config',c_arguments);
if (/\.config.js/.test(configfile)){
    console.error('不用输入.config.js')
    return;
}
const prefix='../../../';
configfile=prefix+'config/'+configfile+'.config.js'
let config=require(configfile);
let devConfig=config.dev;
let {rootPath,hostname,port}=devConfig;
rootPath=Path.resolve(__dirname,rootPath);
App({
    rootPath,
    hostname,
    port
})
