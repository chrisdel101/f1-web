const utils = require('../utils')
const json = require('../test.json')

async function fetchDriver(ctx, next) {
  const data = await utils.fetchData()
  // console.log(data)
  // const drivers = utils.getDriverNames(data)
  // console.log(ctx.request.body.selectDriver)
  // const driverObj = makeDriverObj(data, drivers, ctx.request.body.selectDriver)
  // // console.log('here', ctx.urls)
  // await ctx.render('driver', {
  //   urls: ctx.urls,
  //   title: ctx.title,
  //   capitalize: utils.capitalize,
  //   routeName: 'driver',
  //   enums: drivers,
  //   method: 'POST',
  //   action: '/driver',
  //   enctype: 'application/x-www-form-urlencoded',
  //   buttonField: 'Submit',
  //   buttonType: 'submit',
  //   buttonValue: 'submit',
  //   selectName: 'selectDriver',
  //   driverObj: driverObj
  // })
}
// get driver data from form name
function getDriverfromFormData(data, drivers, name) {
  const nameId = drivers.filter(driver => driver.name === name)
  return data.stage.competitors.filter(
    competitor => competitor.id === nameId[0].id
  )
}

function makeDriverObj(data, drivers, name) {
  const driverData = getDriverfromFormData(data, drivers, name)
  return {
    id: driverData[0].id,
    name: driverCardName(name),
    imgName: driverImageName(name),
    nationality: driverData[0].nationality,
    team: driverData[0].team.name,
    teamId: driverData[0].team.id,
    points: driverData[0].result.points,
    carNumber: driverData[0].result.car_number,
    currentRank: driverData[0].result.position,
    victories: driverData[0].result.victories,
    seasonRaces: driverData[0].result.races,
    seasonRaceWpoints: driverData[0].result.races_with_points,
    polePositions: driverData[0].result.polepositions,
    podiums: driverData[0].result.podiums,
    fastestLap: driverData[0].result.fastest_laps
  }
}
function driverCardName(name) {
  let names = name.split(' ')
  names[0] = names[0].substr(0, names[0].length - 1)
  return `${names[1]} ${names[0]}`
}
// make into format for image string
function driverImageName(name) {
  let names = name.split(' ')
  names[0] = names[0].substr(0, names[0].length - 1)
  names = `${names[1]}-${names[0]}`.toLowerCase()
  return names
}
module.exports = {
  fetchDriver: fetchDriver,
  makeDriverObj: makeDriverObj
}
