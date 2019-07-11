const https = require('https')
const title = 'Formula 1'
const json = require('../test.json')
module.exports = {
  render: async (ctx, next) => {
    let drivers = await module.exports.getDrivers()
    await ctx.render('index', {
      title: title,
      drivers: drivers,
      method: 'POST',
      action: '/driver',
      enctype: 'application/x-www-form-urlencoded',
      buttonField: 'Submit'
    })
  },
  getDrivers: async id => {
    const stageUrl = `https://api.sportradar.us/formula1/trial/v2/en/sport_events/sr:stage:324771/summary.json?api_key=${
      process.env.F1
    }`
    const call = module.exports.httpCall(stageUrl)
    let json = await call
    json = JSON.parse(json)
    const names = json.stage.competitors.map(obj => {
      return obj.name
    })
    return names
  },
  httpCall: async url => {
    return new Promise((resolve, reject) => {
      https.get(url, res => {
        res.setEncoding('utf8')
        res.on('data', d => {
          resolve(d)
        })
      })
    })
  }
}
