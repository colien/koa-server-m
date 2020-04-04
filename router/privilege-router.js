const router = require('koa-router')()
router.prefix('/privilege');

router.get('/', function (ctx, next) {
  ctx.body = ''
})

module.exports = router
