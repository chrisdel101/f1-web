var router = require('koa-router')()
var indexController = require('../controllers/index.controller')
var driversController = require('../controllers/drivers.controller')
var teamsController = require('../controllers/teams.controller')
var utils = require('../utils')
var API = require('../API/index')
var fs = require('fs')
var puppeteer = require('puppeteer')
let cache = require('../cache')

// cache related
router.get('/reset-cache', utils.resetCache)
router.get('/view-cache', ctx => {
  console.log(utils.viewCache(ctx))
})
router.get('/fresh-fetch', indexController.freshFetch)
// ---------templates
router.get('/', indexController.renderIndex)
router.get('/demo', indexController.renderDemo)
router.get('/drivers', driversController.renderAllDriversList)
// render full template with query params- like POST
router.get('/driver', driversController.renderDriverTemplate)
router.get('/team', teamsController.renderTeamTemplate)
// render cards
router.get('/driver/:driver_slug', driversController.renderDriverCard)
router.get('/team/:team_slug', teamsController.renderTeamCard)
// API - take images of cards
// moblie size - uses puppeteer viewport to get
router.get('/api/mobile/driver/:driver_slug', async ctx => {
  return API.sendImage(ctx, 'driver').then(res => {
    return (ctx.body = res)
  })
})
router.get('/api/mobile/team/:team_slug', async ctx => {
  return API.sendImage(ctx, 'team').then(res => {
    return (ctx.body = res)
  })
})
router.get('/api/driver/:driver_slug', async ctx => {
  return API.sendImage(ctx, 'driver').then(res => {
    return (ctx.body = res)
  })
})
router.get('/api/team/:team_slug', async ctx => {
  return API.sendImage(ctx, 'team').then(res => {
    return (ctx.body = res)
  })
})
router.get('/test/:driver_slug', async ctx => {
  const image = await API.sendImage(ctx, ctx.params.driver_slug)
  console.log('image', image)
  ctx.body = image
})
module.exports = router
