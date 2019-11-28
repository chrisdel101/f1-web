const utils = require('../utils')
const urls = require('../urls')
const fs = require('fs')
var puppeteer = require('puppeteer')
// HANDLES ALL CALLS TO MSNGR
// when POST recieved send data to DB
async function sendUserDatatoDB(data) {
  return await utils.httpPostCall(`${urls.localCardsEndpoint}/test`, data)
}
// get user ID from url and send id and data to API DB
//send POST back to msg to close window and confirm data was saved
// ask user next question

// return GET image to messenger
async function takeCardScreenShot(ctx, type) {
  const types = ['driver', 'team']
  if (!types.includes(type)) {
    console.error('Incorrect type in takeCardScreenShot API')
    return
  }
  // const urlParts = ctx.path.split('/')
  // console.log('URL', urlParts)
  try {
    // access checks if file exists - takes path
    if (process.env.NODE_ENV === 'testing') {
      fs.access('./tests/api/test.png', err => {
        if (!err) {
          console.log('myfile exists')
          fs.unlink('./tests/api/test.png', err => {
            if (err) throw err
          })
        } else {
          console.log('myfile does not exist')
        }
      })
    } else {
      fs.access('./example.png', err => {
        if (!err) {
          console.log('myfile exists')
          fs.unlink('./example.png', err => {
            if (err) throw err
          })
        } else {
          console.log('myfile does not exist')
        }
      })
    }
  } catch (err) {
    console.error('Unlinking file error', err)
  }
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    const page = await browser.newPage()
    if (process.env.NODE_ENV === 'development') {
      if (type === 'team') {
        if (ctx.path.includes('api/mobile')) {
          await page.setViewport({
            width: 400,
            height: 600,
            deviceScaleFactor: 1
          })
        } else {
          await page.setViewport({
            width: 1000,
            height: 600,
            deviceScaleFactor: 1
          })
        }
        const req = await page.goto(
          `http://localhost:3000/${type}/${ctx.params.team_slug}`
        )
        if (!utils.statusCodeChecker(req._status)) {
          throw Error(
            `${req._status} error recieved from puppeteer. Check endpoint returns valid res in takeCardScreenShot`
          )
        }
      } else if (type === 'driver') {
        if (ctx.path.includes('api/mobile')) {
          await page.setViewport({
            width: 600,
            height: 600,
            deviceScaleFactor: 1
          })
        } else {
          await page.setViewport({
            width: 900,
            height: 600,
            deviceScaleFactor: 1
          })
        }
        const req = await page.goto(
          `http://localhost:3000/${type}/${ctx.params.driver_slug}`
        )
        if (!utils.statusCodeChecker(req._status)) {
          throw Error(
            `${req._status} error recieved from puppeteer. Check endpoint returns valid res in takeCardScreenShot`
          )
        }
      }
    } else if (process.env.NODE_ENV === 'production') {
      if (type === 'team') {
        if (ctx.path.includes('api/mobile')) {
          await page.setViewport({
            width: 400,
            height: 600,
            deviceScaleFactor: 1
          })
        } else {
          await page.setViewport({
            width: 1000,
            height: 600,
            deviceScaleFactor: 1
          })
        }
        const req = await page.goto(
          `https://f1-cards.herokuapp.com/${type}/${ctx.params.team_slug}`
        )
        if (!utils.statusCodeChecker(req._status)) {
          throw Error(
            `${req._status} error recieved from puppeteer. Check endpoint returns valid res in takeCardScreenShot`
          )
        }
      } else if (type === 'driver') {
        if (ctx.path.includes('api/mobile')) {
          await page.setViewport({
            width: 600,
            height: 600,
            deviceScaleFactor: 1
          })
        } else {
          await page.setViewport({
            width: 900,
            height: 600,
            deviceScaleFactor: 1
          })
        }
        const req = await page.goto(
          `https://f1-cards.herokuapp.com/${type}/${ctx.params.driver_slug}`
        )
        if (!utils.statusCodeChecker(req._status)) {
          throw Error(
            `${req._status} error recieved from puppeteer. Check endpoint returns valid res in takeCardScreenShot`
          )
        }
      }
    } else if (process.env.NODE_ENV === 'testing') {
      if (type === 'driver') {
        if (ctx.path.includes('api/mobile')) {
          await page.setViewport({
            width: 600,
            height: 600,
            deviceScaleFactor: 1
          })
        } else {
          await page.setViewport({
            width: 900,
            height: 600,
            deviceScaleFactor: 1
          })
        }
        const req = await page.goto(
          `http://localhost:3000/${type}/${ctx.params.driver_slug}`
        )
        if (!utils.statusCodeChecker(req._status)) {
          throw Error(
            `${req._status} error recieved from puppeteer. Check endpoint returns valid res in takeCardScreenShot`
          )
        }
      } else if (type === 'team') {
        if (ctx.path.includes('api/mobile')) {
          await page.setViewport({
            width: 400,
            height: 600,
            deviceScaleFactor: 1
          })
        } else {
          await page.setViewport({
            width: 1000,
            height: 600,
            deviceScaleFactor: 1
          })
        }
        // console.log(`http://localhost:3000/${type}/${ctx.params.team_slug}`)
        const req = await page.goto(
          `http://localhost:3000/${type}/${ctx.params.team_slug}`
        )
        if (!utils.statusCodeChecker(req._status)) {
          throw Error(
            `${req._status} error recieved from puppeteer. Check endpoint returns valid res in takeCardScreenShot`
          )
        }
      }
      await page.screenshot({
        path: './tests/api/test.png',
        fullPage: true
      })
      await browser.close()
      return
    }
    await page.screenshot({ path: 'example.png', fullPage: true })
    await browser.close()
  } catch (e) {
    console.error('An error occured in takeImage:', e)
    return 'An error occured in takeImage:', e
  }
  //   set content type to image
  ctx.type = `image/png`
  //   send image to body
  return fs.createReadStream('./example.png')
}
module.exports = {
  takeCardScreenShot,
  sendUserDatatoDB
}
