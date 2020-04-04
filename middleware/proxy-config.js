const httpProxyMiddleware = require('http-proxy-middleware');
const koaConnect = require('koa2-connect');

const { logger } = require('./log-config.js');

const suffix = /(\.html|\.htm)$/i;	//后缀格式指定

const proxy_env = process.env.PROXY_ENV;

module.exports = (app) => {

	// 服务列表
	var serviceList = ["/oms","/vcc"];

	// 获取目标服务域名
	var getTargetDomain = (name, env) => {
		var host = ("https:/" + name + ( env && "-" + env ) +".flightroutes24.com");
		return host;
	}
	// 动态生成环境域名
	var getProxyDomain = (name, env) => {
		var host = (name.substr(1) + ( env && "-" + env ) +".flightroutes24.com");
		return host;
	}
	
	// 生成代理配置对象
	var getProxyConfig = (serviceList,env) => {
		var si = 0;
		var proxyTable = {};
		for(;si < serviceList.length; si++){
			var name = serviceList[si];
			proxyTable[name] = createProxyConfig(name, env);
		}
		return proxyTable;
	}

	// 获取每个服务的代理配置
	var createProxyConfig = (name,env) =>{
		var targetHost = getTargetDomain(name,env);
		var proxyHost = getProxyDomain(name,env);
		return {
			target: targetHost,
			changeOrigin: true,		// 默认false，是否需要改变原始主机头为目标URL
			autoRewrite: false,
			/*ws: false,*/				// 是否代理websockets
			/*secure: false,*/
			onProxyReq (proxyReq, req) {
			    // 将本地请求的头信息复制一遍给代理。
			    // 包含cookie信息，这样就能用登录后的cookie请求相关资源
			    Object.keys(req.headers).forEach(function (key) {
					//console.log(key,req.headers[key])
			      proxyReq.setHeader(key, req.headers[key])
			    });
			    // 代理的host 设置成被代理服务的，解决跨域访问
			    proxyReq.setHeader('Host', proxyHost);
			},
			onProxyRes (proxyRes, req, res) {
			    // 将服务器返回的头信息，复制一遍给本地请求的响应。
			    // 这样就能实现 执行完登录后，本地的返回请求中也有相关cookie，从而实现登录功能代理。
			    Object.keys(proxyRes.headers).forEach(function (key) {
			      //res.append(key, proxyRes.headers[key])
			    });
				console.log(proxyRes);
				console.log("-------------------");
				console.log(res);
				Object.assign(res, proxyRes.headers);
			},
			onError (err, req, res) {
				//console.log("error",err);
				res.writeHead(500, {
					'Content-Type': 'text/plain'
				});
				res.end('');
			}
		}
	}
	
	// 代理兼容封装
	const proxy = function (serviceName, options) {
	  if (typeof options === 'string') {
		options = {
		  target: options
		}
	  }
	  return async function (ctx, next) {
		// 除 html 和 htm ，其他都直接下一步
		if(suffix.test(ctx.path)){
			ctx.respond = false;
			var value = await koaConnect(httpProxyMiddleware(serviceName, options))(ctx, next);
			console.log("proxy",value);
			//await next();
		}else{
			await next();
		}
	  }
	}
	
	var proxyConfig = getProxyConfig(serviceList,proxy_env);

	// 挂载代理
	Object.keys(proxyConfig).map(serviceName => {
	  const options = proxyConfig[serviceName]
	  app.use(proxy(serviceName, options))
	});
}

