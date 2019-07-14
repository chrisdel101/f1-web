const utils = require('../utils')
module.exports = {
  render: async (ctx, next) => {
    const data = await utils.fetchData()
    const drivers = utils.getDriverNames(data)
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
