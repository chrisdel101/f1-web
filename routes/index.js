const router = require('koa-router')()
const indexController = require('../controllers/index.controller')
const driversController = require('../controllers/drivers.controller')
const teamsController = require('../controllers/teams.controller')

router.get('/', indexController.render)
router.get('/driver', driversController.fetchDriver)
router.get('/team', teamsController.fetchTeam)
router.get('/api/driver/:driver_slug', driversController.takeImage)
module.exports = router
