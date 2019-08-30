const router = require('koa-router')()
const indexController = require('../controllers/index.controller')
const driversController = require('../controllers/drivers.controller')
const teamsController = require('../controllers/teams.controller')
const utils = require('../utils')

router.get('/', indexController.render)
router.get('/driver', driversController.renderDriverTemplate)
router.get('/team', teamsController.fetchTeam)
router.get('/driver/:driver_slug', driversController.renderDriverCard)
router.get('/api/driver/:driver_slug', utils.takeImage)
module.exports = router
