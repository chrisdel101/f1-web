const utils = require('../utils')
require('dotenv').config(
  '/Users/chrisdielschnieder/desktop/code_work/formula1/f1Web/.env'
)

async function fetchDriver(driverSlug) {
  return JSON.parse(await utils.fetchEndpoint(`drivers/${driverSlug}`))
}

async function fetchDrivers() {
  return JSON.parse(await utils.fetchEndpoint('drivers'))
}

module.exports = {
  fetchDriver,
  fetchDrivers,
}
