const utils = require('../utils')
module.exports = {
  render: async (ctx, next) => {
    const driversObj = await module.exports.handleDrivers(ctx, next)
    // console.log('drivers', driversObj)
    const teamsObj = await module.exports.handleTeams(ctx, next)
    await ctx.render('index', {
      title: ctx.title,
      method: 'POST',
      action: '/driver',
      enctype: 'application/x-www-form-urlencoded',
      buttonField: 'Submit',
      buttonType: 'submit',
      buttonValue: 'submit',
      driverSelectName: driversObj.selectName,
      driverEnums: driversObj.driversArr
    })
  },
  handleDrivers: async (ctx, next) => {
    try {
      const driversArr = JSON.parse(await utils.fetchData('drivers'))
      return {
        driversArr: driversArr,
        selectName: 'selectDriver'
      }
    } catch {
      const error = {
        message: 'Internal Server Error',
        status: 500,
        detail: 'Could not parse driver information.',
        stack: new Error().stack
      }
      await ctx.render('error', error)
    }
  },
  handleTeams: async (ctx, next) => {
    try {
      const teams = JSON.parse(await utils.fetchData('teams'))
      return {
        enums: drivers,
        method: 'POST',
        action: '/driver',
        enctype: 'application/x-www-form-urlencoded',
        buttonField: 'Submit',
        buttonType: 'submit',
        buttonValue: 'submit',
        selectName: 'selectDriver',
        routeName: 'index'
      }
    } catch {
      const error = {
        message: 'Internal Server Error',
        status: 500,
        detail: 'Could not parse driver information.',
        stack: new Error().stack
      }
      await ctx.render('error', error)
    }
  }
}
