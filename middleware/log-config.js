const log4js = require('koa-log4');
const path = require("path");
const dirCongit = require("../config/dir-config.js");

var locBaseDir = process.env.LOG_DIR;

log4js.configure({
	appenders: {
		access: {
			type: 'dateFile',							// 文件类型
			pattern: '-yyyy-MM-dd.log',					// 生成文件的规则
			filename: path.join(dirCongit.rootDir ,locBaseDir + 'logs/', 'colien-m-access'), // 生成文件名
			alwaysIncludePattern : true,				// 和上面同时使用 设置每天生成log名
		},
		application: {
			type: 'dateFile',
			pattern: '-yyyy-MM-dd.log',
			filename: path.join(dirCongit.rootDir ,locBaseDir + 'logs/', 'colien-m-application'),
			alwaysIncludePattern : true,
		},
		out: {
			type: 'console'
		}
	},
	categories: {
		default: { appenders: [ 'out' ], level: 'info' },
		access: { appenders: [ 'access' ], level: 'info' },
		application: { appenders: [ 'application' ], level: 'info'}
	},
	pm2: true,
	disableClustering: true
});

exports.accessLogger = () => log4js.koaLogger(log4js.getLogger('access')); //记录所有访问级别的日志
exports.logger = log4js.getLogger('application'); //记录所有应用级别的日志