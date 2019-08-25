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
    } else if (
      process.env.API_ENV === 'flask' ||
      process.env.API_ENV === 'test'
    ) {
      console.log('test')
      const call = module.exports.httpCall(urls.localDev(params))
      // console.log('C', call)
      let remoteJson = await call
      // console.log('REM', remoteJson)
      return remoteJson
    }
  },

  hyphenate: name => {
    name = name.replace(',', ' ')
    let names = name.split(' ')
    return `${names[0]}-${names[1]}`.toLowerCase()
  },
  // remove seperators and replace with others
  addSeparator: (word, separatorToAdd, separatorToRemove = '_') => {
    if (!word) {
      console.error('Warning: addSeparator must take a word')
      return 'N/A'
    }
    return word.split(separatorToRemove).join(separatorToAdd)
  },
  // cap beginning of each seperate word
  capitalize: word => {
    return word && word[0].toUpperCase() + word.slice(1)
  },
  // shorted from Red_Bull_Racing to Red_Bull
  teamShortener: fullName => {
    if (fullName === 'Haas F1 Team') {
      return 'Hass'
    }
    // count whitespaces - get num of words
    const whiteSpaces = fullName.split(' ').length - 1
    // 2 words or toro rosso, etc
    if (whiteSpaces <= 1) {
      return fullName
    }
    // else more than 2 words - red bull racing etc
    let splitName = fullName.split('')
    let newName = ''
    let whiteSpace = 0
    for (let i = 0; i < splitName.length; i++) {
      if (splitName[i] === ' ') {
        whiteSpace++
      }
      if (whiteSpace >= whiteSpaces) {
        return newName
      }
      newName += splitName[i]
    }
  },
  getSelectData: async (cache, route) => {
    try {
      let dataObj
      // console.log('route', route)
      // console.log('cache', cache)
      // console.log('ent', cache)
      // console.log('rou', cache[route])
      // console.log('len', cache[route] && cache[route].length)
      if (cache[route] && cache[route].length) {
        // console.log('here')
        dataObj = cache[route]
      } else {
        // console.log('below')
        dataObj = JSON.parse(await module.exports.fetchData(route))
      }
      return dataObj
    } catch (e) {
      console.log('Error in getSelectedData', e)
      await ctx.render('error', error)
    }
  }
}
