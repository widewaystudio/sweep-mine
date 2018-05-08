var gulp = require("gulp");
var imagemin = require("gulp-imagemin");
var newer = require("gulp-newer");
var htmlClean = require("gulp-htmlclean");
var uglify = require("gulp-uglify");
var stripDebug = require("gulp-strip-debug");
var concat = require("gulp-concat");
var less = require("gulp-less");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var cssnano = require("gulp-cssnano");
var connect  = require("gulp-connect");
var folder = {
	src:"./src/",
	build : "./build/"
}

var devMode = process.env.NODE_ENV == "development";

gulp.task('images',function(){
	var page = gulp.src(folder.src + "images/*")
	  page.pipe(newer(folder.build + "images"))
	  page.pipe(connect.reload())
	  page.pipe(imagemin())
	  page.pipe(gulp.dest(folder.build + "images/"))
});


gulp.task('html',function(){
	var page = gulp.src(folder.src + "/*")	
	if(!devMode){
		page.pipe(htmlClean())
	    page.pipe(connect.reload())
	}
	page.pipe(gulp.dest(folder.build))

})

gulp.task('js',function(){
	var page = gulp.src(folder.src + "js/*")
	if(!devMode){
	page.pipe(stripDebug())
	page.pipe(uglify())	
	}	
	page.pipe(connect.reload())
	page.pipe(gulp.dest(folder.build + "js/"))
})

gulp.task('css',function(){
	var options = [autoprefixer(),cssnano()];
	gulp.src(folder.src + "css/*")
	 .pipe(less())
	 .pipe(connect.reload())
	 .pipe(gulp.dest(folder.build + "css/"))
})
gulp.task('watch',function(){
	gulp.watch(folder.src + "js/*",["js"]);
	gulp.watch(folder.src + "css/*",["css"]);
	gulp.watch(folder.src + "/*",["html"]);
	gulp.watch(folder.src + "images/*",["images"]);
})

gulp.task('server',function(){
	connect.server({
		port : '8091',
		livereload : true
	});

})

gulp.task("default",['html','images','js','css','watch','server'],function(){

})