const https = require('https')
const http = require('http')
const { urls, cardTypes } = require('./constants')
const puppeteer = require('puppeteer')
let globalCache = require('./cache')
const moment = require('moment')
var url = require('url')
const debug = require('debug')
const log = debug('app:log')
const error = debug('app:error')

module.exports = {
  toggleNextEndpointDriver: (ctx) => {
    if (ctx.path.includes(cardTypes.DRIVERS)) {
      return '/demo?demo-driver='
    } else if (ctx.path.includes('demo')) {
      return '/drivers/'
    }
  },
  toggleNextEndpointTeam: (ctx) => {
    if (ctx.path.includes(cardTypes.TEAMS)) {
      return '/demo?demo-team='
    } else if (ctx.path.includes('demo')) {
      return '/teams/'
    }
  },
  // toggle the local var
  toggleHideNav: (ctx) => {
    ctx.state.hideNav = !ctx.state.hideNav
  },
  ENV: process.env?.NODE_ENV === 'development' ? 'development' : ' production',
  verifyAPI_KEY: (apiKey) => {
    return apiKey === process.env.API_KEY ? true : false
  },
  // https://stackoverflow.com/a/1527820/5972531
  randomNumInRange: (min, max) => {
    return Math.random() * (max - min) + min
  },
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
  isObjEmpty: (obj) => {
    if (Object.keys(obj).length === 0 && obj.constructor === Object) {
      return true
    }
    return false
  },
  objValueExists: (obj, value) => {
    return Object.values(obj).some((objItem) => objItem === value)
  },
  // check if each obj props are in exceptionArr, else delete
  delAllObjExcept: (obj, validKeys) => {
    Object.keys(obj).forEach(
      (key) => validKeys.includes(key) || delete obj[key]
    )
    return obj
  },
  httpCall: async (_url) => {
    return new Promise((resolve) => {
      const url = new URL(_url)
      const options = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        headers: {
          'x-Api-Key': process.env.API_KEY ?? '12345',
          'Content-Type': 'application/json',
        },
      }
      const req = http
        .get(options, (res) => {
          if (res?.statusCode != 200) {
            if (!module.exports.statusCodeChecker(res?.statusCode)) {
              throw Error(
                `${req._status} error in httpCall. Check backend and DB`
              )
            } else {
              console.error(
                `Status code ${res.statusCode} in httpCall. Check server and DB.`
              )
            }
          }
          res.setEncoding('utf8')
          res.on('data', (d) => {
            resolve(d)
          })
        })
        .on('error', (e) => {
          error(`HTTP error: ${e.message}`)
          if (e.code === 'ECONNREFUSED') {
            log('Local DB is not running')
            req.shouldKeepAlive = false
            req.destroy()
          }
        })
    })
  },
  httpsCall: async (_url) => {
    return new Promise((resolve) => {
      const url = new URL(_url)
      const options = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        headers: {
          'x-Api-Key': process.env.API_KEY ?? '12345',
          'Content-Type': 'application/json',
        },
      }
      https
        .get(options, (res) => {
          if (res?.statusCode != 200) {
            if (!module.exports.statusCodeChecker(res?.statusCode)) {
              throw Error(
                `${req._status} error in httpsCall. Check backend and DB`
              )
            } else {
              console.error(
                `Status code ${res.statusCode} in httpsCall. Check server and DB.`
              )
            }
          }
          res.setEncoding('utf8')
          res.on('data', (d) => {
            resolve(d)
          })
        })
        .on('error', (e) => {
          error(`HTTPS error: ${e.message}`)
          if (e.code === 'ECONNREFUSED') {
            log('Local DB is not running')
            req.shouldKeepAlive = false
            req.destroy()
          }
        })
    })
  },
  httpPostCall: async (url, data) => {
    const newUrl = new URL(url)
    if (typeof data !== 'string') {
      if (process.env.LOGS != 'off') {
        data = JSON.stringify(data)
        log('LOGS: stringify in httpPostCall', data)
      }
    }
    try {
      const options = {
        hostname: newUrl.hostname,
        port: newUrl.port,
        path: newUrl.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-Api-Key': process.env.API_KEY ?? '12345',
          'Content-Length': data.length,
        },
      }

      const req = http.request(options, (res) => {
        if (process.env.LOGS != 'off') {
          log(`LOGS:  STATUS: ${res.statusCode}`)
          log(`LOGS: HEADERS: ${JSON.stringify(res.headers)}`)
        }
        res.setEncoding('utf8')
      })

      req.on('error', (e) => {
        error(`problem with request: ${e.message}`)
        throw Error(`problem with request: ${e.message}`)
      })

      // Write data to request body
      if (process.env.LOGS !== 'OFF') {
        log('LOGS: data', data)
      }

      req.write(data)
      req.end()
      return 'Post Complete'
    } catch (e) {
      error('Error in httpPostCall', e)
    }
  },
  fetchEndpoint: async (params) => {
    try {
      switch (module.exports.ENV) {
        case 'testing':
        case 'development':
          const localEndPoint = await module.exports.httpCall(
            urls.localF1(params)
          )
          // console.log('REM', remoteJson)
          return localEndPoint
        default: //'prod_testing':,'production':
          // console.log('xx', urls.prodF1(params))
          const prodEndPoint = await module.exports.httpsCall(
            urls.prodF1(params)
          )
          // console.log('REM', remoteJson2)
          return prodEndPoint
      }
    } catch (e) {
      error('An error in util.fetchEndpoint', e)
    }
  },
  // cap beginning of each seperate word
  capitalizeFirstLetter: (word) => {
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
        // console.log('view-cache:', globalCache)
        return globalCache
      }
    } catch (e) {
      error('An error in viewCache', e)
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
        log('Cache cleared: ', cache)
        return cache
      }
    } catch (e) {
      error('An error in viewCache', e)
    }
  },
  takeImage: async (ctx) => {
    //
    try {
      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      })
      const page = await browser.newPage()
      if (module.exports.ENV === 'development') {
        await page.goto(
          `http://localhost:3000/driver/${ctx.params.driver_slug}`
        )
      } else if (module.exports.ENV === 'production') {
        await page.goto(
          `https://f1-cards.herokuapp.com/api/driver/${ctx.params.driver_slug}`
        )
      }
      await page.screenshot({ path: 'example.png' })
      await browser.close()
    } catch (e) {
      error('An error occured in takeImage:', e)
      return 'An error occured in takeImage:', e
    }
  },
  // false for 400 and 500s
  statusCodeChecker(code) {
    if (code >= 400 && code <= 599) {
      return false
    }
    return true
  },
}
