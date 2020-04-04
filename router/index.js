const router = require('koa-router')()
const fs = require('fs')
const path = require('path')
 
const files = fs.readdirSync(__dirname);
files.filter(file => ~file.search(/^[^\.].*\.js$/))
    .forEach(file => {
        if (file !== 'index.js') {
			const file_entity = require(path.join(__dirname, file));
            router.use(file_entity.routes(), file_entity.allowedMethods())
        }
    })

module.exports = router