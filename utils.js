const https = require('https')
const http = require('http')
const urls = require('./urls')
const utils = require('./utils')
const puppeteer = require('puppeteer')
let cache = require('./cache')

module.exports = {
  isObjEmpty: obj => {
    if (Object.keys(obj).length === 0 && obj.constructor === Object) {
      return true
    }
    return false
  },
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
  httpsCall: async url => {
    return new Promise((resolve, reject) => {
      https.get(url, res => {
        res.setEncoding('utf8')
        res.on('data', d => {
          resolve(d)
        })
      })
    })
  },
  fetchData: async params => {
    try {
      if (
        process.env.NODE_ENV === 'development' ||
        process.env.NODE_ENV === 'test'
      ) {
        const call = module.exports.httpCall(urls.localDev(params))
        // console.log('C', call)
        let remoteJson = await call
        // console.log('REM', remoteJson)
        return remoteJson
      } else if (process.env.NODE_ENV === 'production') {
        const call = module.exports.httpsCall(urls.prodUrl(params))
        let remoteJson = await call
        // console.log('REM', remoteJson)
        return remoteJson
      }
    } catch (e) {
      console.error('An error in util.fetchData', e)
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
  // takes the cache to store
  // take a route i.e. /drivers to get from
  // returns the data from the cache
  getSelectData: async (cache, route) => {
    try {
      let dataObj
      // console.log('route', route)
      // console.log('cache', cache)
      // console.log('ent', cache)
      // console.log('rou', cache[route])
      // console.log('len', cache[route] && cache[route].length)
      // if cache param add to cache
      if (cache && (cache[route] && cache[route].length)) {
        console.log(`get ${route} from cache`)
        dataObj = cache[route]
        // else get data from DB
      } else {
        dataObj = JSON.parse(await module.exports.fetchData(route))
        // console.log('below', dataObj)
      }
      return dataObj
    } catch (e) {
      console.log('Error in getSelectedData', e)
      await ctx.render('error', error)
    }
  },
  viewCache: (ctx, type) => {
    try {
      if (ctx && (ctx.params && ctx.params.type)) {
        type = ctx.params.type
      }
      if (type === 'teams') {
        if (!cache.teams) {
          return {}
        }
        return cache.teams
      } else if (type === 'drivers') {
        if (!cache.drivers) {
          return {}
        }
        return cache.drivers
      } else {
        return cache
      }
    } catch (e) {
      console.error('An error in viewCache', e)
    }
  },
  resetCache: type => {
    try {
      if (type === 'teams') {
        if (!cache.teams) {
          return {}
        }
        delete cache.teams
        return cache
      } else if (type === 'drivers') {
        if (!cache.drivers) {
          return {}
        }
        delete cache.drivers
        return cache
      } else {
        cache = {}
        return cache
      }
    } catch (e) {
      console.error('An error in viewCache', e)
    }
  },
  takeImage: async ctx => {
    //
    try {
      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      })
      console.log('HERE 1')
      const page = await browser.newPage()
      if (process.env.NODE_ENV === 'development') {
        await page.goto(
          `http://localhost:3000/driver/${ctx.params.driver_slug}`
        )
      } else if (process.env.NODE_ENV === 'production') {
        await page.goto(
          `https://f1-cards.herokuapp.com/api/driver/${ctx.params.driver_slug}`
        )
        console.log('HERE 2')
      }
      await page.screenshot({ path: 'example.png' })
      console.log('here 3')
      await browser.close()
      console.log('here 3')
    } catch (e) {
      console.error('An error occured in takeImage:', e)
      return 'An error occured in takeImage:', e
    }
  }
}
