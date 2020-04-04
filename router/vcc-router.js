const router = require('koa-router')()
router.prefix('/vcc');

router.get('/', function (ctx, next) {
  ctx.body = ''
})

module.exports = router
