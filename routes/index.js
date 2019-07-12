const router = require('koa-router')()
const indexController = require('../controllers/index.controller')
const driversController = require('../controllers/drivers.controller')

router.get('/', indexController.render)

router.post('/driver', (ctx, next) => {
  console.log(ctx.request.body)
})
router.get('/', async (ctx, next) => {})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
