const utils = require('../utils')
const cache = require('../cache')
const urls = require('../urls')
const indexController = require('./index.controller')
const puppeteer = require('puppeteer')

async function takeImage(ctx) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('/driver?driver=kimi-raikkonen')
  await page.screenshot({ path: 'example.png' })

  await browser.close()
}
// check cache in indexController for data before calling db
async function handleFormData() {
  const drivers = await indexController.handleDrivers()
  const teams = await indexController.handleTeams()
  return {
    drivers,
    teams
  }
}
async function fetchDriver(ctx) {
  const driverSlug = ctx.query.driver
  const formData = await handleFormData()
  const driversObj = formData.drivers
  const teamsObj = formData.teams
  // console.log('driv', driversObj.selectName)
  const driverData = JSON.parse(
    await utils.fetchData(`drivers/${ctx.query.driver}`)
  )
  // look up drivers team
  const teamData = JSON.parse(
    await utils.fetchData(`teams/${driverData.team_id}`)
  )
  const teamUrl = `/team?team=${driverData.team_name_slug}`
  // add link to team to driver
  driverData['teamUrl'] = teamUrl
  console.log('Driver Data', driverData)
  await ctx.render('driver', {
    urls: ctx.urls,
    title: ctx.title,
    capitalize: utils.capitalize,
    separator: utils.addSeparator,
    routeName: 'driver',
    driverEnums: driversObj.driversArr,
    teamEnums: teamsObj.teamsArr,
    method: 'GET',
    buttonField: 'Submit',
    buttonType: 'submit',
    buttonValue: 'submit',
    teamAction: teamsObj.teamAction,
    teamSelectName: teamsObj.selectName,
    driverAction: driversObj.driverAction,
    driverSelectName: driversObj.selectName,
    driverData: driverData,
    teamData: teamData
  })
}
module.exports = {
  fetchDriver,
  takeImage
}
