let {foreachFile,writeFile}=require('./FSTools')
const Path=require('path');
const fs = require('fs');
const UglifyJS = require('uglify-js');

var uglifycss = require('uglifycss');
const less = require( 'less' )  // 引入 less 模块
let dirPath=Path.resolve(__dirname,'../web/assets')

function convertLess(srcPath,isMinify=true) {
    let isOk=/\.less/.test(srcPath);
    if (!isOk) return;
    let distPath=srcPath.split('.less').join('')+'.css';
    const ejs=require('ejs');
    let options={};
    let data={
        rootpath:Path.resolve(__dirname,'../../'),
        require
    };
    ejs.renderFile(srcPath, data, options, function(err, data){
    //fs.readFile(srcPath, 'utf8', (err,data) => {
        // data.toString()
        if( err ) {
            throw err
        }
        // 这里我们读取到了 less 文件内容
        // console.log( data )
        // 在代码中调用 less
        less.render(data,(err,css)=>{
            if( err ) {
                console.log(err)
                throw err
            }
            // 在这里我们得到了 less 编译后的 css 内容
            //console.log( distPath,css.css )
            // 下面就是要将 css.css 写入到文件中
            fs.writeFile( distPath, css.css, ( err ) => {
                if ( err ) {
                    console.log(err)
                    throw err
                }
                if(isMinify) minifyCssCurrentPath(distPath);
                // 输出 success 编译写入成功
                //console.log( 'success' )
            })

        })

    })
}
function transformJS(filePath){
    console.log('transformJS filePath:'+filePath)
    let isOk=/\.js$/.test(filePath);
    let isOk1=/\.min\.js$/.test(filePath);
    if (!isOk) return;
    if (isOk1) return; //.min.js不显示
    var babel = require("@babel/core");
    let options={
        presets:[
            ['@babel/preset-env',{
                "targets": {
                    "ie": "8"
                },
                loose:true
            }],
           // ['@babel/preset-typescript',{allExtensions:true}]
        ],
        //"plugins": ["@babel/plugin-proposal-async-generator-functions"]
    }
    babel.transformFile(filePath, options,async function (err, result) {
        if( err ) {
            console.log('transformJS err:')
            console.log(err)
            throw err
        }
        //console.log('result.map:',result.map)
        let dp=Path.dirname(filePath)
        let basename=Path.basename(filePath,'.js');
        let partname='.min.js'
        let toFilePath=Path.resolve(dp,'./'+basename+partname)
        //console.log(result)
        let toFilePathES2015=toFilePath+'.es2015'
        await writeFile(toFilePathES2015,result.code);
        //await writeFile(toFilePath,result.code);
        let mapFile=toFilePath+'.map'
        await writeFile(mapFile,result.map);
        let minCode=UglifyJS.minify(toFilePathES2015).code;
        //await writeFile(toFilePath,minCode+'\n//@ sourceMappingURL='+basename+'.min.js.map');
        await writeFile(toFilePath,minCode);
        //result; // => { code, map, ast }
    });
}
function minifyJs(filePath,toFilePath=null) {
    let isOk=/\.js$/.test(filePath);
    let isOk1=/\.min\.js$/.test(filePath);
    if (!isOk) return false;
    if (isOk1) return false;
    let minCode=UglifyJS.minify(filePath).code;
    writeFile(toFilePath,minCode);
    return;
}
function minifyCss(filePath,toFilePath=null) {
    let isOk=/\.css$/.test(filePath);
    let isOk1=/\.min\.css$/.test(filePath);
    if (!isOk) return false;
    if (isOk1) return false;
    var minCode = uglifycss.processFiles(
        [filePath],
        { maxLineLen: 500, expandVars: true }
    );
    writeFile(toFilePath,minCode);
    return true;
}
function minifyJsCurrentPath(filePath) {
    console.log('minifyJsCurrentPath filePath:'+filePath)
    let isOk=/\.js$/.test(filePath);
    let isOk1=/\.min\.js$/.test(filePath);
    if (!isOk) return false;
    if (isOk1) return false;
    let dp=Path.dirname(filePath)
    let basename=Path.basename(filePath,'.js');
    let partname='.min.js'
    let toFilePath=Path.resolve(dp,'./'+basename+partname)

    let minCode=UglifyJS.minify(filePath).code;
    console.log('minify toFilePath save:'+toFilePath)
    writeFile(toFilePath,minCode);
    return true;
}
function minifyCssCurrentPath(filePath) {
    let isOk=/\.css$/.test(filePath);
    let isOk1=/\.min\.css$/.test(filePath);
    if (!isOk) return false;
    if (isOk1) return false;

    let dp=Path.dirname(filePath)
    let basename=Path.basename(filePath,'.css');
    let partname='.min.css'
    let toFilePath=Path.resolve(dp,'./'+basename+partname)


    var minCode = uglifycss.processFiles(
        [filePath],
        { maxLineLen: 500, expandVars: true }
    );
    console.log('minifyCssCurrentPath toFilePath:'+toFilePath)
    writeFile(toFilePath,minCode);
    return true;
}
function beautifier(dirPath,isReplace=false) {
    foreachFile(dirPath,function(info){
        let {filePath,fileName}=info;
        let dp=Path.dirname(filePath);
        let isMinJS=/\.min\.js$/.test(fileName);
        if (!isMinJS){
            //编译压缩js
            let isJS=/\.js$/.test(fileName);
            if (isJS){
                //console.log('--------',minCode)
                let basename=Path.basename(filePath,'.js');
                let partname=isReplace?'.js':'.min.js'
                let minFile=Path.resolve(dp,'./'+basename+partname)
                //console.log('minFile:'+minFile)
                minifyJs(filePath,minFile);
            }
            //writeFile();
            //console.log(filePath,minCode)
        }
        let isLess=/\.less$/.test(fileName);
        if (isLess){
            //编译压缩less+css
            convertLess(filePath)  //自带压缩css
        }else{
            //编译压缩css
            let isMinMinCss=/\.min\.css$/.test(fileName);
            if (!isMinMinCss){
                let isCss=/\.css$/.test(fileName);
                if (isCss){
                    let basename=Path.basename(filePath,'.css');
                    let partname=isReplace?'.css':'.min.css'
                    let minFile=Path.resolve(dp,'./'+basename+'.min.css')
                    //console.log('minFile:'+minFile)
                    minifyCss(filePath,minFile)
                }
                //writeFile();
                //console.log(filePath,minCode)
            }
        }
        //console.log(fileName+' isJS:'+isJS);
    })
}
module.exports={convertLess,beautifier,transformJS,minifyJs,minifyCss,minifyJsCurrentPath,minifyCssCurrentPath}