const utils = require('../utils')
const json = require('../test.json')
const urls = require('../urls')

async function fetchDriver(ctx, next) {
  const data = await utils.fetchData()
  const drivers = utils.getDriverNames(data)
  // console.log(ctx.request.body.selectDriver)
  const driverObj = makeDriverObj(data, drivers, ctx.request.body.selectDriver)
  // console.log('DO', driverObj)
  await ctx.render('driver', {
    routeName: 'driver',
    title: ctx.title,
    enums: drivers,
    method: 'POST',
    action: '/driver',
    enctype: 'application/x-www-form-urlencoded',
    buttonField: 'Submit',
    buttonType: 'submit',
    buttonValue: 'submit',
    selectName: 'selectDriver',
    driverObj: driverObj[0]
  })
}
// get driver data from form name
function makeDriverObj(data, drivers, name) {
  const driver = drivers.filter(driver => driver.name === name)
  let competitor = data.stage.competitors.filter(
    competitor => competitor.id === driver[0].id
  )
  // console.log(driverImageName(competitor[0].name))
  competitor[0].img = urls.F1driverImage(driverImageName(competitor[0].name))
  // console.log(competitor)
  return competitor
}
// make into format for image string
function driverImageName(name) {
  let names = name.split(' ')
  names[0] = names[0].substr(0, names[0].length - 1)
  names = `${names[1]}-${names[0]}`.toLowerCase()
  console.log(names)
  return names
}
module.exports = {
  fetchDriver: fetchDriver,
  makeDriverObject: this.makeDriverObject
}
