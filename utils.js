const https = require('https')
const http = require('http')
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
  fetchData: async params => {
    if (process.env.API_ENV === 'remote') {
      const stageUrl = urls.f12019url(process.env.F1)
      const call = module.exports.httpCall(stageUrl)
      let remoteJson = await call
      remoteJson = JSON.parse(remoteJson)
      return remoteJson
    } else if (process.env.API_ENV === 'local') {
      // TODO
      return
    } else if (process.env.API_ENV === 'flask') {
      const call = module.exports.httpCall(urls.localDev(params))
      let remoteJson = await call
      return remoteJson
    }
  },
  hyphenate: name => {
    name = name.replace(',', ' ')
    let names = name.split(' ')
    return `${names[0]}-${names[1]}`.toLowerCase()
  },
  // remove seperators
  unSlugify: (word, separatorToAdd, separatorToRemove = '_') => {
    return word.split(separatorToRemove).join(separatorToAdd)
  },
  capitalize: word => {
    return word && word[0].toUpperCase() + word.slice(1)
  }
}
