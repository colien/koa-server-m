const request = require('request');
const { logger } = require('./log-config.js');
const hostConfig = require('../config/host-config.js');

// 静态资源的匹配规则
const staticSuffix = /(\.png|\.gif|\.jpg|\.jpeg|\.svg|\.ico|\.eot|\.ttf|\.woff|\.bmp|\.jpeg|\.css|\.js)$/i;

// 当前的启动环境
const proxy_env = process.env.PROXY_ENV;
const node_env = process.env.NODE_ENV;

// host 列表
const hostList = hostConfig(proxy_env);

const DOMAIN = ".flightroutes24.com";

const NOT_FOUND_CODE = 404;

module.exports = ()=>{
	return async function(ctx, next) {
		// 非静态资源请求（包括 html）
		if(ctx.path != "/" && !staticSuffix.test(ctx.path)){

			// 拿到 path 后面第一个 /*/的内容，用来判断当前服务
			var beforePath = ctx.path.match(/\/([a-zA-Z0-9]+)\//); 
			var confHost = beforePath && hostList[beforePath[0]];
			if(!beforePath || !confHost){
				await next();
				logger.error("Path cannot be resolved ", ctx.host + ctx.path);
				return;
			}
			
			// 代理环境如果不为空，说明是测试或开发环境，需要自动组装当前的请求 host
			if(proxy_env){
				confHost = confHost + "-" + proxy_env + DOMAIN;
			}

			// 拿到 host 必须检查是否和请求 host 一致，防止 a 域名请求 /b/ 服务的资源，隔离服务
			// 需要注意，如果提前静态资源了，这个地方需要调整
			if(node_env != "local" && ctx.host !== confHost){ // 排除本地，不需要判断
				logger.error(`Host mapping error:reqHost:${ctx.host} ; currHost:${confHost}`);
				ctx.status = NOT_FOUND_CODE;
				ctx.body = "";
				return;
			}
			
			var headers = createProxyHeader(ctx, confHost);

			var options = {
				method : ctx.method,
				uri: headers.origin + beforePath[0] + "checkAuthority",
				headers : headers,
			};
			//console.log(options);
			var data = await authProxy(options);

			//console.log(data.statusCode);

			var isXHR = ctx.header["X-Requested-With"];
			
			if(data.statusCode == 200){
				await next() 
			}else if(isXHR != "XMLHttpRequest" && data.statusCode == 484){ // 登陆失败
				ctx.status = data.statusCode;
				try{
					if(Object.prototype.toString.call(data.body)=="[object String]"){
						data.body = JSON.parse(data.body);
					}
					ctx.redirect(data.body.loginUrl  + "?backUrl=" + ctx.href);
					logger.error(`AuthProxy login fail: currHost:${confHost} , code:${data.statusCode} , body:${data.body}`);
					return;
				}catch(e){
					logger.error("AuthProxy to JSON error:",error);
					ctx.body = data.body;
					return;
				}
			}else{
				logger.error(`AuthProxy error: currHost:${confHost} , code:${data.statusCode} , body:${data.body}`);
				ctx.status = data.statusCode;
				ctx.body = data.body;
				return;
			}
		}else{
			await next();
		}
	}
}

// 复制请求 header 的信息，携带 cookie
let createProxyHeader = (ctx,confHost) => {
	var headerObj = {};
	for(var key in ctx.header){
		headerObj[key] = ctx.header[key];
	}
	headerObj.host = confHost;
	headerObj["Check-Url"] = ctx.url;
	headerObj["origin"] =  ctx.protocol + "://" + headerObj.host;
	headerObj["X-Requested-With"] = "XMLHttpRequest";
	return headerObj;
}

// 请求判断权限的代理
let authProxy = (options)=>{
	return new Promise((resolve,reject)=>{
		request(options,function(error, response, body){
			if(error){
				logger.error(error);
				resolve(error);
				return;
			}
			resolve(response);
		})
	})
}