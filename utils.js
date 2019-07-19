const https = require('https')
const http = require('http')
const json = require('./test.json')
const urls = require('./urls')
const utils = require('./utils')

module.exports = {
  httpCall: async url => {
    return new Promise((resolve, reject) => {
      http.get(url, res => {
        res.setEncoding('utf8')
        res.on('data', d => {
          resolve(d)
        })
      })
    })
  },
  getDriverNames: data => {
    // return data.stage.competitors.map(obj => {
    //   // extract id from string in data
    //   // const id = obj.id.split(':')[obj.id.split(':').length - 1]
    //   return {
    //     name: obj.name,
    //     id: obj.id
    //   }
    // })
  },
  fetchData: async params => {
    if (process.env.API_ENV === 'remote') {
      const stageUrl = urls.f12019url(process.env.F1)
      const call = module.exports.httpCall(stageUrl)
      let remoteJson = await call
      remoteJson = JSON.parse(remoteJson)
      return remoteJson
    } else if (process.env.API_ENV === 'local') {
      return json
    } else if (process.env.API_ENV === 'flask') {
      const call = module.exports.httpCall(urls.localDev(params))
      let remoteJson = await call
      return remoteJson
    }
  },
  capitalize: word => {
    return word && word[0].toUpperCase() + word.slice(1)
  }
}
