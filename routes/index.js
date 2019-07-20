const router = require('koa-router')()
const indexController = require('../controllers/index.controller')
const driversController = require('../controllers/drivers.controller')
// console.log(driversController)
const { catchErrors } = require('../errorHandlers')

router.get('/', catchErrors(indexController.render))

router.post('/driver', catchErrors(driversController.fetchDriver))

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
