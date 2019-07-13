const router = require('koa-router')()
const indexController = require('../controllers/index.controller')
const driversController = require('../controllers/drivers.controller')
// console.log(driversController)

router.get('/', indexController.render)

router.post('/driver', async (ctx, next) => {
  console.log('here')
  // driversController.fetchDriver(ctx, next).then(res => console.log(res))
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
