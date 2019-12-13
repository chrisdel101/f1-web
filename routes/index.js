const router = require('koa-router')()
const indexController = require('../controllers/index.controller')
const driversController = require('../controllers/drivers.controller')
const teamsController = require('../controllers/teams.controller')
const utils = require('../utils')
const urls = require('../urls')
const API = require('../API/index')

// cache related
router.get('/reset-cache', utils.resetCache)
router.get('/view-cache', utils.viewCache)
router.get('/fresh-fetch', indexController.freshFetch)
// ---------templates
router.get('/', indexController.renderIndex)
router.get('/demo', indexController.renderDemo)
router.get('/teams', teamsController.renderAllTeamsList)
router.get('/drivers', driversController.renderAllDriversList)
// render full template with query params- like POST
router.get('/driver', driversController.renderDriverTemplate)
router.get('/team', teamsController.renderTeamTemplate)
// render cards
router.get('/driver/:driver_slug', driversController.renderDriverCard)
router.get('/team/:team_slug', teamsController.renderTeamCard)
//---- WEBVIEWS
router.post('/drivers', ctx => {
  if (process.env.LOGs !== 'off') {
    console.log('LOGS: /drivers req body', ctx.request.body)
  }
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'testing'
  ) {
    ctx.response.status = 200
    // console.log('here', typeof ctx.request.body)
    return API.sendUserData(ctx.request.body, urls.localDev('user'))
  } else {
    return API.sendUserData(ctx.request.body, urls.prodUrl('user'))
  }
})
router.post('/teams', ctx => {
  console.log('teams', ctx.request.body)
  return API.sendUserData(ctx.request.body, urls.localDev('user'))
})
// API - take images of cards
// moblie size - uses puppeteer viewport to get
router.get('/api/mobile/driver/:driver_slug', async ctx => {
  return API.takeCardScreenShot(ctx, 'driver').then(res => {
    return (ctx.body = res)
  })
})
router.get('/api/mobile/team/:team_slug', async ctx => {
  return API.takeCardScreenShot(ctx, 'team').then(res => {
    return (ctx.body = res)
  })
})
router.get('/api/driver/:driver_slug', async ctx => {
  return API.takeCardScreenShot(ctx, 'driver').then(res => {
    return (ctx.body = res)
  })
})
router.get('/api/team/:team_slug', async ctx => {
  return API.takeCardScreenShot(ctx, 'team').then(res => {
    return (ctx.body = res)
  })
})
router.get('/test/:driver_slug', async ctx => {
  const image = await API.takeCardScreenShot(ctx, ctx.params.driver_slug)
  console.log('image', image)
  ctx.body = image
})
module.exports = router
// TEST ROUTE
router.post('/test', async ctx => {
  console.log(ctx.request.body)
  ctx.response.status = 200
  return await ctx.response.status
})
router.get('/test', async ctx => {
  console.log(ctx.request.body)
  ctx.response.status = 200
  return await ctx.response.status
})
