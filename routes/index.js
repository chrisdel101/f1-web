const router = require('koa-router')()
const indexController = require('../controllers/index.controller')
const driversController = require('../controllers/drivers.controller')
const teamsController = require('../controllers/teams.controller')

router.get('/', indexController.render)

router.post('/driver', driversController.fetchDriver)
router.post('/team', teamsController.fetchTeam)
module.exports = router
