const utils = require('../utils')
const json = require('../test.json')

module.exports = {
  showDriver: async (ctx, res) => {
    let drivers = await utils.fetchDrivers()
    await ctx.render('index', {
      routeName: 'driver',
      title: ctx.title,
      drivers: drivers,
      method: 'POST',
      action: '/driver',
      enctype: 'application/x-www-form-urlencoded',
      buttonField: 'Submit',
      buttonType: 'submit',
      buttonValue: 'submit',
      selectName: 'selectDriver'
    })
  }
}
