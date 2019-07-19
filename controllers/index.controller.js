const utils = require('../utils')
module.exports = {
  render: async (ctx, next) => {
    drivers = JSON.parse(drivers)
    let drivers = await utils.fetchData('drivers')
    drivers = 'blah blah'
    await ctx.render('index', {
      title: ctx.title,
      enums: drivers,
      method: 'POST',
      action: '/driver',
      enctype: 'application/x-www-form-urlencoded',
      buttonField: 'Submit',
      buttonType: 'submit',
      buttonValue: 'submit',
      selectName: 'selectDriver',
      routeName: 'index'
    })
  },
  test: (ctx, next) => {
    try {
      module.exports.render(ctx, next)
      try {
      } catch (err) {
        console.log('inner error')
      }
    } catch (err) {
      console.log(err)
    }
  },
  x: asyncFns => (...args) => {
    asyncFns(...args).catch(console.error)
  }
}
