const utils = require('../utils')
module.exports = {
  render: async (ctx, next) => {
    let drivers = await utils.fetchDrivers()
    await ctx.render('index', {
      title: ctx.title,
      drivers: drivers,
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
  fetchDrivers: async id => {
    // const stageUrl = `https://api.sportradar.us/formula1/trial/v2/en/sport_events/sr:stage:324771/summary.json?api_key=${
    //   process.env.F1
    // }`
    // const call = utils.httpCall(stageUrl)
    // let json = await call
    // json = JSON.parse(json)
    const names = json.stage.competitors.map(obj => {
      return obj.name
    })
    return names
  }
}
