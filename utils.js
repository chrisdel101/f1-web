const https = require('https')
const json = require('./test.json')
const urls = require('./urls')

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
      // const id = obj.id.split(':')[obj.id.split(':').length - 1]
      return {
        name: obj.name,
        id: obj.id
      }
    })
  },
  fetchData: async id => {
    // const stageUrl = `urls.F1API(process.env)`
    // const call = utils.httpCall(stageUrl)
    // let json = await call
    // json = JSON.parse(json)
    return json
  },
  capitalize: word => {
    return word && word[0].toUpperCase() + word.slice(1)
  }
}
