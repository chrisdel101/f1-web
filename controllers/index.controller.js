const utils = require('../utils')
module.exports = {
  render: async (ctx, next) => {
    // let drivers = await utils.fetchData('drivers')
    const drivers = JSON.parse(await utils.fetchData('drivers'))
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
  }
}
