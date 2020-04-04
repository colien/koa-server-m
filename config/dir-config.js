var path = require('path');

var moduleExports = {};

// 源文件目录
moduleExports.rootDir = path.resolve(__dirname, '../'); // 项目根目录
moduleExports.mdwDir = path.resolve(moduleExports.rootDir, './middleware'); // 扩展中间件目录
moduleExports.configDir = path.resolve(moduleExports.rootDir, './config'); // 配置文件目录
moduleExports.publicDir = path.resolve(moduleExports.rootDir, './public'); // 静态资源目录
moduleExports.viewsDir = path.resolve(moduleExports.rootDir, './views'); // 项目模板目录

// node_module 目录
moduleExports.nondeModuleDir = path.resolve(moduleExports.rootDir, './node_modules');

module.exports = moduleExports;
