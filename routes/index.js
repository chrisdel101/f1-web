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
  utils.viewCache(ctx)
})

// render full template
router.get('/driver', driversController.renderDriverTemplate)
router.get('/team', teamsController.renderTeamTemplate)
// render just cards
router.get('/driver/:driver_slug', driversController.renderDriverCard)
router.get('/team/:team_slug', teamsController.renderTeamCard)
// send image to messenger
router.get('/api/driver/:driver_slug', async ctx => {
  return API.sendImage(ctx, 'driver').then(res => {
    return (ctx.body = res)
  })
})
// / send image to messenger
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
