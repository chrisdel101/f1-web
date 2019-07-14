const utils = require('../utils')
const json = require('../test.json')

async function fetchDriver(ctx, next) {
  const data = await utils.fetchData()
  const drivers = utils.getDriverNames(data)
  console.log(ctx.request.body)
  // console.log(drivers)
  // const driverObj = makeDriverObj(data, ctx.request.body)
  await ctx.render('index', {
    routeName: 'driver',
    title: ctx.title,
    enums: drivers,
    method: 'POST',
    action: '/driver',
    enctype: 'application/x-www-form-urlencoded',
    buttonField: 'Submit',
    buttonType: 'submit',
    buttonValue: 'submit',
    selectName: 'selectDriver'
  })
}
async function makeDriverObj(data, id) {
  console.log(id)
}
module.exports = {
  fetchDriver: fetchDriver,
  makeDriverObject: this.makeDriverObject
}
