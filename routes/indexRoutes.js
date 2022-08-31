const router = require('koa-router')()
const indexController = require('../controllers/index.controller')
const driversController = require('../controllers/drivers.controller')
const demoController = require('../controllers/demo.controller')
const teamsController = require('../controllers/teams.controller')
const utils = require('../utils')

// cache related
router.get('/reset-cache', utils.resetCache)
router.get('/view-cache', utils.viewCache)
router.get('/fresh-fetch', indexController.freshFetch)

router.get('/', indexController.renderIndex)
router.get('/demo', demoController.renderDemo)
router.get('/teams', teamsController.renderAllTeamsPage)
router.get('/drivers', driversController.renderAllDriversPage)
router.get('/demo/driver', demoController.renderDemo)
router.get('/demo/team', demoController.renderDemo)
// render cards
router.get('/drivers/:name_slug', driversController.renderDriverPage)
router.get('/teams/:name_slug', teamsController.renderTeamPage)

module.exports = router
