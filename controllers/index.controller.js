const https = require('https')
const title = 'Formula 1'
const json = require('../test.json')
module.exports = {
  render: async (ctx, next) => {
    ctx.body = await module.exports.getDriver()
    let test = await module.exports.getDriver()
    console.log(test.stage)
    // await ctx.render('index', {})
  },
  getDriver: async id => {
    // const stageUrl = `https://api.sportradar.us/formula1/trial/v2/en/sport_events/sr:stage:324771/summary.json?api_key=${
    //   process.env.F1
    // }`
    // const call = module.exports.httpCall(stageUrl)
    // const json = await call
    // return call
    return new Promise((resolve, reject) => {
      resolve(json)
    })
  },
  httpCall: url => {
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
