const https = require('https')
const json = require('./test.json')

module.exports = {
  httpCall: async url => {
    return new Promise((resolve, reject) => {
      https.get(url, res => {
        res.setEncoding('utf8')
        res.on('data', d => {
          resolve(d)
        })
      })
    })
  },
  getDriverNames: data => {
    return data.stage.competitors.map(obj => {
      // extract id from string in data
      const id = obj.id.split(':')[obj.id.split(':').length - 1]
      return {
        name: obj.name,
        id: id
      }
    })
  },
  fetchData: async id => {
    // const stageUrl = `https://api.sportradar.us/formula1/trial/v2/en/sport_events/sr:stage:324771/summary.json?api_key=${
    //   process.env.F1
    // }`
    // const call = utils.httpCall(stageUrl)
    // let json = await call
    // json = JSON.parse(json)
    return json
  }
}
