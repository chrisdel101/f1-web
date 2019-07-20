const router = require('koa-router')()
const indexController = require('../controllers/index.controller')
const driversController = require('../controllers/drivers.controller')

router.get('/', indexController.render)

router.post('/driver', driversController.fetchDriver)

module.exports = router
