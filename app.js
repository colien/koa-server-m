const Koa = require("koa");
const koaStatic = require('koa-static');
const views = require('koa-views')
const ejs = require('ejs');
const path = require("path");
const os = require('os');
const { logger, accessLogger } = require('./middleware/log-config.js');
//const authProxy = require("./middleware/authProxy-config.js");
const catchError = require("./middleware/catchError-config.js");
const router = require("./router/index.js");

var app = new Koa();

/* 请求是按中间件的引入顺序执行的，一定要注意中间件的添加顺序
*/ 

// 全局捕获异常
app.use(catchError()); 

// 应用日志 - 访问日志
app.use(accessLogger());	

// 加载模板引擎
app.use(views(__dirname+'/public', {
  extension: 'html',	// 模板文件扩展名
  map : {html:'ejs'},	// 指定渲染的模板引擎, key: 模板文件扩展名(和 extension 保持一致)，value: 使用的引擎类型
}))
		
// http 代理   ==> 没有匹配到路由的就按静态资源请求处理
//app.use(authProxy());
// 静态资源处理中间件
app.use(koaStatic(path.resolve(__dirname, "./public")));
// 注册路由
app.use(router.routes());

//app.use(router.allowedMethods());

/*app.use(async (ctx, next) => {
  await next();
  if(parseInt(ctx.status) === 404 ){
    ctx.response.redirect("/404")
  }
})

router.get('/500.html',async function(ctx,next) {
    await ctx.render('oms/500', {
		title:"500"
	});
});

router.get('/404.html',async function(ctx,next) {
    await ctx.render('oms/404', {
		title : "400",
	});
});
*/

// 根据环境设置启动端口
app.listen(process.env.PORT,() => {
  logger.info(`server running at ${process.env.PORT||8001}/`);
});