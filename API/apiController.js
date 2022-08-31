// HANDLES CALLS TO OTHER SERVERS
const utils = require('../utils')
const { urls, screenShotTypes } = require('../constants')
const fs = require('fs')
var puppeteer = require('puppeteer')

// send post to endpoint
async function sendUserData(data, url) {
  utils.verifyAPI_KEY()
  return await utils.httpPostCall(url, data)
}
// take screen shot of endpoints entered
async function takeCardScreenShot(ctx, screenShotType) {
  if (screenShotTypes.hasOwnProperty(screenShotType)) {
    console.error(
      'Incorrect type in takeCardScreenShot API. Need one of: drivers, teams'
    )
    return
  }
  // console.log('ctx', ctx)
  // set content type to image
  ctx.type = `image/png`
  try {
    // access checks if file exists - takes path
    if (process.env.NODE_ENV === 'testing') {
      // err - if file does not exist
      fs.access('./tests/api/test.png', (err) => {
        if (!err) {
          console.log('myfile exists')
          fs.unlink('./tests/api/test.png', (err) => {
            // unlink err
            if (err) throw Error('An error occured in unlinking', err)
          })
        } else {
          console.log('myfile does not exist')
        }
      })
    } else {
      //   fs.access('./example.png', (err) => {
      //     if (!err) {
      //       console.log('myfile exists HERE')
      //       fs.unlink('./example.png', (err) => {
      //         if (err) {
      //           console.error('An error occured in unlinking', err)
      //           throw Error('An error occured in unlinking')
      //         }
      //       })
      //     } else {
      //       console.log('myfile does not exist')
      //     }
      //   })
    }
  } catch (err) {
    console.error('Unlinking file error', err)
  }

  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
    const page = await browser.newPage()
    if (process.env.NODE_ENV === 'development') {
      if (screenShotType === screenShotTypes.TEAMS) {
        if (ctx.path.includes('api/mobile')) {
          await page.setViewport({
            width: 400,
            height: 600,
            deviceScaleFactor: 1,
          })
        } else {
          await page.setViewport({
            width: 1000,
            height: 600,
            deviceScaleFactor: 1,
          })
        }
        const req = await page.goto(
          `http://localhost:3000/${screenShotType}/${ctx.params.team_slug}?noNav=true`
        )
        if (!utils.statusCodeChecker(req._status)) {
          throw Error(
            `${req._status} error recieved from puppeteer. Check endpoint returns valid res in takeCardScreenShot`
          )
        }
      } else if (screenShotType === screenShotTypes.DRIVERS) {
        if (ctx.path.includes('api/mobile')) {
          await page.setViewport({
            width: 600,
            height: 600,
            deviceScaleFactor: 1,
          })
        } else {
          await page.setViewport({
            width: 900,
            height: 600,
            deviceScaleFactor: 1,
          })
        }
        const req = await page.goto(
          `http://localhost:3000/${screenShotType}/${ctx.params.name_slug}?noNav=true`
        )
        if (!utils.statusCodeChecker(req._status)) {
          throw Error(
            `${req._status} error recieved from puppeteer. Check endpoint returns valid res in takeCardScreenShot`
          )
        }
      }
    } else if (process.env.NODE_ENV === 'production') {
      if (screenShotType === 'team') {
        if (ctx.path.includes('api/mobile')) {
          await page.setViewport({
            width: 400,
            height: 600,
            deviceScaleFactor: 1,
          })
        } else {
          await page.setViewport({
            width: 1000,
            height: 600,
            deviceScaleFactor: 1,
          })
        }
        const req = await page.goto(
          `https://f1-cards.herokuapp.com/${screenShotType}/${ctx.params.team_slug}`
        )
        if (!utils.statusCodeChecker(req._status)) {
          throw Error(
            `${req._status} error recieved from puppeteer. Check endpoint returns valid res in takeCardScreenShot`
          )
        }
      } else if (screenShotType === screenShotTypes.DRIVERS) {
        if (ctx.path.includes('api/mobile')) {
          await page.setViewport({
            width: 600,
            height: 600,
            deviceScaleFactor: 1,
          })
        } else {
          await page.setViewport({
            width: 900,
            height: 600,
            deviceScaleFactor: 1,
          })
        }
        const req = await page.goto(
          `https://f1-cards.herokuapp.com/${screenShotType}/${ctx.params.name_slug}`
        )
        if (!utils.statusCodeChecker(req._status)) {
          throw Error(
            `${req._status} error recieved from puppeteer. Check endpoint returns valid res in takeCardScreenShot`
          )
        }
      }
    } else if (process.env.NODE_ENV === 'testing') {
      if (screenShotType === screenShotTypes.DRIVERS) {
        if (ctx.path.includes('api/mobile')) {
          await page.setViewport({
            width: 600,
            height: 600,
            deviceScaleFactor: 1,
          })
        } else {
          await page.setViewport({
            width: 900,
            height: 600,
            deviceScaleFactor: 1,
          })
        }
        console.log(
          `${urls.localCardsEndpoint}/${screenShotType}/${ctx.params.name_slug}`
        )
        const req = await page.goto(
          `${urls.localCardsEndpoint}/${screenShotType}/${ctx.params.name_slug}`
        )
        if (!utils.statusCodeChecker(req._status)) {
          throw Error(
            `${req._status} error recieved from puppeteer. Check endpoint returns valid res in takeCardScreenShot`
          )
        }
      } else if (screenShotType === screenShotType.TEAMS) {
        if (ctx.path.includes('api/mobile')) {
          await page.setViewport({
            width: 400,
            height: 600,
            deviceScaleFactor: 1,
          })
        } else {
          await page.setViewport({
            width: 1000,
            height: 600,
            deviceScaleFactor: 1,
          })
        }
        // console.log(`http://localhost:3000/${screenShotType}/${ctx.params.team_slug}`)
        const req = await page.goto(
          `${urls.localCardsEndpoint}/${screenShotType}/${ctx.params.team_slug}`
        )
        if (!utils.statusCodeChecker(req._status)) {
          throw Error(
            `${req._status} error recieved from puppeteer. Check endpoint returns valid res in takeCardScreenShot`
          )
        }
      }
      await page.screenshot({
        path: './tests/api/test.png',
        fullPage: true,
      })
      await browser.close()
      return fs.createReadStream('./tests/api/test.png')
      // return fs.createReadStream('./tests/api/test.png')
    }
    if (process.env.NODE_ENV !== 'testing') {
      await page.screenshot({ path: 'example.png', fullPage: true })
      await browser.close()
      return fs.createReadStream('./example.png')
    }
  } catch (e) {
    console.error('An error occured in takeImage:', e)
    return 'An error occured in takeImage:', e
  }
  //   send image to body
}
module.exports = {
  takeCardScreenShot,
  sendUserData,
}
