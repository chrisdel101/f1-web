const router = require('koa-router')()
const indexController = require('../controllers/index.controller')

router.get('/', indexController.render)

router.get('/driver', async (ctx, next) => {
  const res = indexController.httpCall(
    `https://api.sportradar.us/formula1/trial/v2/en/competitors/sr:competitor:7135/profile.json?api_key=${
      process.env.F1
    }
    `
  )
  const val = await res
  console.log(val)
  ctx.body = val
  await ctx.render('index', {
    title: title
  })
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
