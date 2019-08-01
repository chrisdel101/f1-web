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
      // console.log(remoteJson)
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
  }
}