const ejs=require('ejs');
const Path=require('path');
const fse = require('fs-extra')
let {readDir,exists,writeFile,lstat,isDirectory,mkdir,rmdir,mkdirx}=require('./FSTools')
let {beautifier}=require('./beautifier')
//https://github.com/jprichardson/node-fs-extra
const readEjsFile = function (file,data={}){
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
function relativePath(prefixPath,path) {
    let arrTem=path.split(prefixPath)
    //console.log('relativePath:',prefixPath,path,arrTem)
    let chekDirPath=arrTem[1];
    //console.log('relativePath #:'+chekDirPath)
    return chekDirPath;
}
async function build({copyPaths,ejsPaths,rootPath,beautifierPath,buildPath}) {
    console.log(`build:copyPaths:${JSON.stringify(copyPaths)}\nejsPaths:${JSON.stringify(ejsPaths)} \nrootPath:${rootPath} \nbuildPath:${buildPath} \nbeautifierPath:${beautifierPath}`)
    await fse.remove(buildPath).catch(e=>console.log(e));
    let mkdirx_r=Path.resolve(buildPath,'../');
    let mkdirx_r1=buildPath.split(mkdirx_r)[1];
    await mkdirx(mkdirx_r,mkdirx_r1).catch(e=>console.log(e));
    //压缩
    /*console.log('beautifier...');
    for (let i=0;i<beautifierPath.length;i++){
        let temPath=Path.resolve(rootPath,beautifierPath[i])
        beautifier(temPath,true);
    }*/
    //拷贝
    console.log('copy...')
    for (let i=0;i<copyPaths.length;i++){
        let temPath=Path.resolve(rootPath,copyPaths[i].from)
        let temTo=Path.resolve(buildPath,copyPaths[i].to)
        console.log('copy:'+temPath+'=>'+temTo)
        await fse.copy(temPath,temTo).catch(e=>console.log(e));
    }
    //ejs生html
    console.log('ejs to html...')
    for (let d=0;d<ejsPaths.length;d++){
        console.log('from:'+ejsPaths[d].from+' to:'+ejsPaths[d].to)
        let dirPath=Path.resolve(rootPath,ejsPaths[d].from);
        let toPath;
        if (ejsPaths[d].to==''){
            toPath=buildPath;
        }else{
            toPath=Path.resolve(buildPath,ejsPaths[d].to);
        }
        let dirList=await readDir(dirPath).catch(e=>console.log(e));
        if (ejsPaths[d].to!=''){
            let tp=toPath.split(buildPath)[1]
            await mkdirx(buildPath,tp).catch(e=>console.log(e));
        }
        for (let j=0;j<dirList.length;j++){
            let fromPath=Path.resolve(dirPath,dirList[j])
            let toPathHtml=Path.resolve(toPath,dirList[j]);
            let isD=await isDirectory(fromPath).catch(e=>console.log(e));
            if (!isD){
                let content=await readEjsFile(fromPath).catch(e=>console.log(e));
                console.log('write from:'+fromPath+' => '+toPathHtml)
                await writeFile(toPathHtml,content).catch(e=>console.log(e));
            }else{
                console.log('write error from:'+fromPath+' => '+toPathHtml)
            }

        }
    }


}
module.exports=build;