const router = require('koa-router')()
const indexController = require('../controllers/index.controller')
const driversController = require('../controllers/drivers.controller')
const teamsController = require('../controllers/teams.controller')
const sessionsController = require('../controllers/sessions.controller')
const utils = require('../utils')
const urls = require('../urls')
const API = require('../API/index')

router.get('/user', () => {
  utils.httpCall(urls.localDev('user-status'))
})
// cache related
router.get('/reset-cache', utils.resetCache)
router.get('/view-cache', utils.viewCache)
router.get('/fresh-fetch', indexController.freshFetch)
// ---------TEMPLATES
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
router.get('/login', sessionsController.renderLoginTemplate)
//FORMS
router.post('/login', sessionsController.userLogin)
//---- WEBVIEWS
router.post('/drivers', ctx => {
  if (process.env.LOGs !== 'off') {
    console.log('LOGS: /drivers req body', ctx.request.body)
  }
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'testing'
  ) {
    try {
      ctx.response.set('Origin', null)
      ctx.response.set('Access-Control-Request-Method', 'POST')
      ctx.response.status = 200
    } catch (e) {
      console.error('An error setting headers', e)
    }
    console.log(ctx)
    return API.sendUserData(ctx.request.body, urls.localDev('user'))
  } else {
    ctx.response.status = 200
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
  try {
    console.log(ctx.request.headers)
    ctx.response.set('Access-Control-Allow-Origin', 'https//google.com')
    ctx.response.set('Origin', 'Vary')
    ctx.response.set('Access-Control-Request-Method', 'POST')
    ctx.response.status = 200
  } catch (e) {
    console.error('An error setting headers', e)
  }
  return await ctx.response.status
})
