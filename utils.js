const https = require('https')
const json = require('./test.json')
const urls = require('./urls')
const utils = require('./utils')

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
    if (process.env.API_ENV === 'remote') {
      const stageUrl = urls.f12019url(process.env.F1)
      const call = module.exports.httpCall(stageUrl)
      let remoteJson = await call
      remoteJson = JSON.parse(remoteJson)
      return remoteJson
    } else if (process.env.API_ENV === 'local') {
      return json
    }
  },
  capitalize: word => {
    return word && word[0].toUpperCase() + word.slice(1)
  }
}
