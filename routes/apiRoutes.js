const router = require('koa-router')()
const driversController = require('../controllers/drivers.controller')
const teamsController = require('../controllers/teams.controller')
const { screenShotTypes } = require('../constants')
const apiController = require('../API/api.controller')
// take driver sceenshot with slug
router.get('/api/take-screenshot/drivers/:name_slug', async (ctx) => {
  // send html version
  if (ctx.query.html === 'true') {
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
// take driver sceenshot with slug
router.get('/api/take-screenshot/teams/:name_slug', async (ctx) => {
  if (ctx.query.html === 'true') {
    return teamsController.renderTeamCard(ctx)
  } else {
    return apiController
      .takeCardScreenShot(ctx, screenShotTypes.TEAMS)
      .then((res) => {
        return (ctx.body = res)
      })
  }
})
// return driver SS or html card
router.get('/api/take-screenshots', apiController.takeAllPreRunScreenShots)
// take driver sceenshot with slug
router.get('/api/drivers/:name_slug', async (ctx) => {
  // send html version
  if (ctx.query.html === 'true') {
    return driversController.renderDriverCard(ctx)
  } else {
    // set img type to avoid downloading img
    ctx.type = `image/png`
    return (ctx.body = apiController.returnImage(ctx, screenShotTypes.DRIVERS))
  }
})
// take team SS or html card
router.get('/api/teams/:name_slug', async (ctx) => {
  // send html version
  if (ctx.query.html === 'true') {
    return teamsController.renderTeamCard(ctx)
  } else {
    // set img type to avoid downloading img
    ctx.type = `image/png`
    return (ctx.body = apiController.returnImage(ctx, screenShotTypes.TEAMS))
  }
})
module.exports = router
