const utils = require('../utils')
module.exports = {
  render: async (ctx, next) => {
    let drivers;
    try {
      drivers = JSON.parse(await utils.fetchData('drivers'))

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
    } catch {
      const error = {
        message: "Internal Server Error",
        status: 500,
        detail: "Could not parse driver information.",
        stack: (new Error()).stack
      };
      await ctx.render('error', error);
    }
  }
}
