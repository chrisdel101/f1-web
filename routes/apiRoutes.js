const router = require('koa-router')()
const driversController = require('../controllers/drivers.controller')
const teamsController = require('../controllers/teams.controller')
const { screenShotTypes } = require('../constants')
const apiController = require('../API/apiController')
// API - take images of cards
// moblie size - uses puppeteer viewport to get
router.get('/api/mobile/drivers/:name_slug', async (ctx) => {
  return apiController
    .takeCardScreenShot(ctx, screenShotTypes.DRIVERS)
    .then((res) => {
      return (ctx.body = res)
    })
})
router.get('/api/mobile/teams/:name_slug', async (ctx) => {
  return apiController
    .takeCardScreenShot(ctx, screenShotTypes.TEAMS)
    .then((res) => {
      return (ctx.body = res)
    })
})
// get driver card in HTML of img
router.get('/api/drivers/:name_slug', async (ctx) => {
  // send html version
  if (ctx.query.noNav === 'true') {
    return driversController.renderDriverCard(ctx)
  } else {
    // send image version
    return apiController
      .takeCardScreenShot(ctx, screenShotTypes.DRIVERS)
      .then((res) => {
        return (ctx.body = res)
      })
  }
})
router.get('/api/teams/:name_slug', async (ctx) => {
  if (ctx.query.noNav === 'true') {
    return teamsController.renderTeamCard(ctx)
  } else {
    return apiController
      .takeCardScreenShot(ctx, screenShotTypes.TEAMS)
      .then((res) => {
        return (ctx.body = res)
      })
  }
})

module.exports = router
