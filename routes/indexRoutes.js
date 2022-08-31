const router = require('koa-router')()
const indexController = require('../controllers/index.controller')
const driversController = require('../controllers/drivers.controller')
const demoController = require('../controllers/demo.controller')
const teamsController = require('../controllers/teams.controller')
const sessionsController = require('../controllers/sessions.controller')
const utils = require('../utils')
const { urls } = require('../constants')

router.get('/user', () => {
  utils.httpCall(urls.localF1('user-status'))
})
// cache related
router.get('/reset-cache', utils.resetCache)
router.get('/view-cache', utils.viewCache)
router.get('/fresh-fetch', indexController.freshFetch)
router.get('/', indexController.renderIndex)
router.get('/demo', demoController.renderDemo)
router.get('/teams', teamsController.renderAllTeamsPage)
router.get('/drivers', driversController.renderAllDriversPage)
// render full tems plate with query params- like POST
router.get('/demo/driver', demoController.renderDemo)
router.get('/demo/team', demoController.renderDemo)
// render cards
router.get('/drivers/:name_slug', driversController.renderDriverPage)
router.get('/teams/:name_slug', teamsController.renderTeamCard)
router.get('/login', sessionsController.renderLoginTemplate)
//FORMS
router.post('/login', sessionsController.userLogin)
//---- WEBVIEWS
router.post('/drivers', (ctx) => {
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
    return API.sendUserData(ctx.request.body, urls.localF1('user'))
  } else {
    ctx.response.status = 200
    return API.sendUserData(ctx.request.body, urls.prodF1('user'))
  }
})
router.post('/teams', (ctx) => {
  console.log('teams', ctx.request.body)
  return API.sendUserData(ctx.request.body, urls.localF1('user'))
})
module.exports = router
