const router = require('koa-router')()
const indexController = require('../controllers/index.controller')
const driversController = require('../controllers/drivers.controller')
const demoController = require('../controllers/demo.controller')
const teamsController = require('../controllers/teams.controller')
const sessionsController = require('../controllers/sessions.controller')
const utils = require('../utils')
const { screenShotTypes } = require('../constants')
const API = require('../API/apiController')
// API - take images of cards
// moblie size - uses puppeteer viewport to get
router.get('/api/mobile/driver/:name_slug', async (ctx) => {
  return API.takeCardScreenShot(ctx, 'driver').then((res) => {
    return (ctx.body = res)
  })
})
router.get('/api/mobile/team/:team_slug', async (ctx) => {
  return API.takeCardScreenShot(ctx, 'team').then((res) => {
    return (ctx.body = res)
  })
})
router.get('/api/drivers/:name_slug', async (ctx) => {
  // send html version
  if (ctx.query.noNav === 'true') {
    return driversController.renderDriverCard(ctx)
  } else {
    // send image
    return API.takeCardScreenShot(ctx, screenShotTypes.DRIVERS).then((res) => {
      return (ctx.body = res)
    })
  }
})
router.get('/api/team/:team_slug', async (ctx) => {
  return API.takeCardScreenShot(ctx, screenShotTypes.TEAMS).then((res) => {
    return (ctx.body = res)
  })
})

module.exports = router
