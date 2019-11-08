const https = require('https')
const http = require('http')
const urls = require('./urls')
const utils = require('./utils')
const puppeteer = require('puppeteer')
let cache = require('./cache')
const moment = require('moment')

module.exports = {
  // check if timestamp is older than mins entered
  verifyTimeStamp: (timeStamp, mins) => {
    // console.log('verify')
    const d1 = new moment(timeStamp)
    const d2 = new moment()
    // subract time1 from time 2
    const diff = moment.duration(d2.diff(d1)).asMinutes()
    // console.log('diff', diff)
    // console.log('mins', mins)
    // less than 30 mins true, else false
    return diff < mins ? true : false
  },
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
        process.env.NODE_ENV === 'testing'
      ) {
        const call = module.exports.httpCall(urls.localDev(params))
        console.log('C', call)
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
  // cap beginning of each seperate word
  capitalize: word => {
    return word && word[0].toUpperCase() + word.slice(1)
  },
  // takes the cache to store
  // take a route i.e. /drivers to get from
  // returns the data from the cache
  getData: async (cache, route) => {
    // JUST fetchs data - does not handle caching
    try {
      let dataObj
      // route matches key in cache - if exists
      // return from cache
      // console.log(route)
      if (cache && (cache[route] && cache[route].length)) {
        // ADD TIMESTAMP next
        console.log(`get ${route} from cache`)
        // }
        dataObj = cache[route]
        // else get data from DB
      } else {
        dataObj = JSON.parse(await module.exports.fetchData(route))
      }
      return dataObj
    } catch (e) {
      console.error('Error in getSelectedData', e)
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
    // console.log('here')
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
        console.log('Cache cleared: ', cache)
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
