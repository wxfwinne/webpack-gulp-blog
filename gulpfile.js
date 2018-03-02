var gulp = require('gulp');
// 其他的gulp插件统一用$来调用，不需要再一个一个require进去了
var $ = require('gulp-load-plugins')();
var open = require('open');

//定义全局目录
var app = {
    srcPath: 'src/',
    prdPath: 'dist/'
};


gulp.task('images',function(){
    gulp.src(app.srcPath + 'images/**/*')
    .pipe($.plumber()) //防止编译出错时停止服务，而是直接给我们抛出错误
    //.pipe(gulp.dest(app.devPath + 'images'))
    // 对图片文件进行压缩处理，然后写入到生dist的img目录下
    .pipe($.imagemin())
    .pipe(gulp.dest(app.prdPath + 'images'))
    // 配合watch实时刷新浏览器
    .pipe($.connect.reload());
});


// 总任务命令
gulp.task('build',['images'])

//自动化构建项目，启动服务器
gulp.task('server',['build'], function() {
  $.connect.server({
    // 启动的根目录
    root: [app.prdPath],
    // 保存修改后自动刷新（针对高级浏览器）
    livereload: true,
    // 端口号
    port: 8080
  });
// 自启动
  open('http://localhost:8080');
// 监控资源文件，实时刷新
  gulp.watch(app.srcPath + '**/*.html', ['html']);
  gulp.watch(app.srcPath + 'css/**/*.css', ['css']);
  gulp.watch(app.srcPath + 'js/**/*.js', ['js']);
  gulp.watch(app.srcPath + 'images/**/*', ['image']);
});
// 配置最后执行gulp时默认执行的命令
gulp.task('default', ['server']);