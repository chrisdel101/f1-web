const driversController = require('./drivers.controller')
const teamsController = require('./teams.controller')
const indexController = require('./index.controller')

console.log('a', driversController)
console.log('b', teamsController)
console.log('c', indexController)
module.exports = {
  driversController,
  teamsController,
  indexController
}
