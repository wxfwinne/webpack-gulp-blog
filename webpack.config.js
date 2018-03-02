var path = require('path');
var webpack = require('webpack');
var htmlWebpackPlugin = require('html-webpack-plugin');
var cleanWebpackPlugin = require('clean-webpack-plugin');
//单独打包css文件插件（当css文件较多又比较大时单独打包比较好）
var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports={
    //入口文件
    entry:{
        index:"./src/js/functions.js",
        liveLearn:"./src/js/liveLearn.js",
        aboutMe:"./src/js/aboutMe.js",
        jquery:"./src/js/jquery.js",
        lifeEmotion:"./src/js/lifeEmotion.js",
        message:"./src/js/message.js",
        register:"./src/js/register.js",
        snow:"./src/js/snow.js",
        toTop:"./src/js/toTop.js",
        domove:"./src/js/domove.js",
    },
    //出口文件
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'js/[name].js',
        //基础路径，为所有的资源文件路径都加上这个前缀(所有后面一定要写斜杠结尾)（一般不用写）
        publicPath:''
    },
    //插件依赖
    plugins:[
        //这个插件会单独从入口文件的js中提取出css文件，并打包成一个文件
        new ExtractTextPlugin({
            filename:'css/[name].css',
            disable:false,
            allChunks: true
        }),
        //在js入口文件中提取出公共样式，打包到common.css文件中
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            minChunks: function (module, count) {
                  var resource = module.resource;
                  // 以 .css 结尾的资源，重复 require 大于 1 次
                  return resource && /\.css$/.test(resource) && count > 1
                }
        }),
        new htmlWebpackPlugin({
            filename:'index.html',
            template:'src/index.html',
            inject:'body',
            chunks:['common','index']    //common为公共样式
        }),
        
        new htmlWebpackPlugin({
            filename:'lifeEmotion.html',
            template:'src/lifeEmotion.html',
            inject:'body',
            chunks:['common','lifeEmotion']
        }),
        new htmlWebpackPlugin({
            filename:'liveLearn.html',
            template:'src/liveLearn.html',
            inject:'body',
            chunks:['common','liveLearn']
        }),
        new htmlWebpackPlugin({
            filename:'message.html',
            template:'src/message.html',
            inject:'body',
            chunks:['common','message']
        }),
        new htmlWebpackPlugin({
            filename:'register.html',
            template:'src/register.html',
            inject:'body',
            chunks:['common','register']
        }),
        new htmlWebpackPlugin({
            filename:'aboutMe.html',
            template:'src/aboutMe.html',
            inject:'body',
            chunks:['common','aboutMe']
        }),
        //清除前一次打包指定的文件夹
        new cleanWebpackPlugin(['dist'])
    ],
    //处理模块资源
    module:{
        rules:[
        {//处理js文件
            test:/\.js$/,
            use:[{
                loader:"babel-loader",
                options:{ 
                //使用latest预设来处理es6语法的js文件
                     presets:['latest'],
                     "ignore": [   //排除这个js文件不使用es6处理，这样就不存在严格模式问题
                                "./src/js/functions.js"
                              ]   
                }
            }],
            exclude:[
                path.resolve(__dirname,'./node_modules')
            ]
         },
         
         // {//处理非模块化的css文件
         //    test:/\.css$/,
         //    use:['style-loader','css-loader'],
           
         // },
         {
            test: /\.css$/,  //单独打包样式
                use: ExtractTextPlugin.extract({
                  fallback: "style-loader",
                  use: ["css-loader"],
                  publicPath:'../'       //处理css里面的样式问题
                })
          },
         
         {//处理图片文件
            test:/\.(jpg|png|gif|jpeg)$/,
            use:[{
                loader:'url-loader',
                options:{
                    //设置图片的最大以base64编码写入html的字节值，
                    //大于这个值则会打包成img文件进行url请求。
                    limit:1200,  //单位是B（字节）
                    //设置打包后的文件名
                    name:'images/[name].[ext]'
                }
            }]
         },
         {//处理ico文件
            test:/\.ico$/,
            use:[{
                loader:'file-loader',
                options:{                    
                    //设置打包后的文件名
                    name:'ico/[name].[ext]'
                }
            }]
         },
        {//处理字体图标文件
            test:/\.(ttf|eot|svg|woff|woff2)$/,
            use:[{
                loader:'file-loader',
                options:{
                    //设置打包后的文件名
                    name:'fonts/[name].[ext]'
                }
            }]
         }
         ]
    },
 
    //服务器启动配置
    // devServer:{
    //     open:true,  //自动打开浏览器
    //     port:8080,  //自定义端口
    //     publicPath:'' , //服务器打包资源的输出路径，一般不用设置（默认是/）
    //     contentBase:'./src' //在内存中找不到打包的资源时默认会去找的路径，一般不用设置
    // }


}