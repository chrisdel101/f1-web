var router = require('koa-router')()
var indexController = require('../controllers/index.controller')
var driversController = require('../controllers/drivers.controller')
var teamsController = require('../controllers/teams.controller')
var utils = require('../utils')
var API = require('../API/index')
var fs = require('fs')
var puppeteer = require('puppeteer')

router.get('/', indexController.render)
router.get('/fresh-fetch', indexController.freshFetch)
router.get('/reset-cache', utils.resetCache)
router.get('/view-cache', ctx => {
  console.log(utils.viewCache(ctx))
})

// render full template with query params
router.get('/driver', driversController.renderDriverTemplate)
router.get('/team', teamsController.renderTeamTemplate)
// render cards
router.get('/driver/:driver_slug', driversController.renderDriverCard)
router.get('/team/:team_slug', teamsController.renderTeamCard)
// API - take images of cards
// moblie size
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
