const https = require('https')
const http = require('http')
const urls = require('./urls')
const puppeteer = require('puppeteer')
let globalCache = require('./cache')
const moment = require('moment')

module.exports = {
  // check if timestamp is older than mins entered
  verifyTimeStamp: (timeStamp, mins) => {
    // console.log('verify', timeStamp)
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
  httpPostCall: async (url, data) => {
    const newUrl = new URL(url)

    data = JSON.stringify(data)
    try {
      const options = {
        hostname: newUrl.hostname,
        port: newUrl.port,
        path: newUrl.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length
        }
      }

      const req = http.request(options, res => {
        if (process.env.LOGS != 'off') {
          console.log(`STATUS: ${res.statusCode}`)
          console.log(`HEADERS: ${JSON.stringify(res.headers)}`)
        }
        res.setEncoding('utf8')
      })

      req.on('error', e => {
        console.error(`problem with request: ${e.message}`)
        throw Error(`problem with request: ${e.message}`)
      })

      // Write data to request body
      req.write(data)
      req.end()
      return 'Post Complete'
    } catch (e) {
      console.error('Error in httpPostCall', e)
    }
  },
  fetchData: async params => {
    try {
      if (
        process.env.NODE_ENV === 'development' ||
        process.env.NODE_ENV === 'testing'
      ) {
        const call = module.exports.httpCall(urls.localDev(params))
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
  viewCache: (ctx, type) => {
    try {
      // take type from params is possible
      if (ctx && ctx.params && ctx.params.type) {
        type = ctx.params.type
      }
      if (type === 'teams') {
        if (!globalCache.teams) {
          return {}
        }
        return globalCache.teams
      } else if (type === 'drivers') {
        if (!globalCache.drivers) {
          return {}
        }
        return globalCache.drivers
      } else {
        console.log('view-cache:', globalCache)
        return globalCache
      }
    } catch (e) {
      console.error('An error in viewCache', e)
    }
  },
  resetCache: (type, passInCache = {}) => {
    // use global cache
    let cache = globalCache
    // if cache passed in use that
    if (!module.exports.isObjEmpty(passInCache)) {
      cache = passInCache
    }
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
      const page = await browser.newPage()
      if (process.env.NODE_ENV === 'development') {
        await page.goto(
          `http://localhost:3000/driver/${ctx.params.driver_slug}`
        )
      } else if (process.env.NODE_ENV === 'production') {
        await page.goto(
          `https://f1-cards.herokuapp.com/api/driver/${ctx.params.driver_slug}`
        )
      }
      await page.screenshot({ path: 'example.png' })
      await browser.close()
    } catch (e) {
      console.error('An error occured in takeImage:', e)
      return 'An error occured in takeImage:', e
    }
  },
  // false for 400 and 500s
  statusCodeChecker(code) {
    if (code >= 400 && code <= 599) {
      return false
    }
    return true
  }
}
