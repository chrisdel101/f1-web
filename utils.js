const https = require("https")
const http = require("http")
const urls = require("./urls")
const puppeteer = require("puppeteer")
let globalCache = require("./cache")
const moment = require("moment")

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
        res.setEncoding("utf8")
        res.on("data", d => {
          resolve(d)
        })
      })
    })
  },
  httpsCall: async url => {
    return new Promise((resolve, reject) => {
      https.get(url, res => {
        res.setEncoding("utf8")
        res.on("data", d => {
          resolve(d)
        })
      })
    })
  },
  fetchData: async params => {
    try {
      if (
        process.env.NODE_ENV === "development" ||
        process.env.NODE_ENV === "testing"
      ) {
        const call = module.exports.httpCall(urls.localDev(params))
        console.log("C", urls.localDev(params))
        let remoteJson = await call
        // console.log('REM', remoteJson)
        return remoteJson
      } else if (process.env.NODE_ENV === "production") {
        const call = module.exports.httpsCall(urls.prodUrl(params))
        let remoteJson = await call
        // console.log('REM', remoteJson)
        return remoteJson
      }
    } catch (e) {
      console.error("An error in util.fetchData", e)
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
      if (type === "teams") {
        if (!cache.teams) {
          return {}
        }
        return cache.teams
      } else if (type === "drivers") {
        if (!cache.drivers) {
          return {}
        }
        return cache.drivers
      } else {
        return cache
      }
    } catch (e) {
      console.error("An error in viewCache", e)
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
      if (type === "teams") {
        if (!cache.teams) {
          return {}
        }
        delete cache.teams
        return cache
      } else if (type === "drivers") {
        if (!cache.drivers) {
          return {}
        }
        delete cache.drivers
        return cache
      } else {
        cache = {}
        console.log("Cache cleared: ", cache)
        return cache
      }
    } catch (e) {
      console.error("An error in viewCache", e)
    }
  },
  takeImage: async ctx => {
    //
    try {
      const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
      })
      console.log("HERE 1")
      const page = await browser.newPage()
      if (process.env.NODE_ENV === "development") {
        await page.goto(
          `http://localhost:3000/driver/${ctx.params.driver_slug}`
        )
      } else if (process.env.NODE_ENV === "production") {
        await page.goto(
          `https://f1-cards.herokuapp.com/api/driver/${ctx.params.driver_slug}`
        )
        console.log("HERE 2")
      }
      await page.screenshot({ path: "example.png" })
      console.log("here 3")
      await browser.close()
      console.log("here 3")
    } catch (e) {
      console.error("An error occured in takeImage:", e)
      return "An error occured in takeImage:", e
    }
  }
}
