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
// tags [ noToggle, noNav, size]
async function takeCardScreenShot(ctx, screenShotType) {
  // add prod dev options later
  const apiHost = 'http://localhost:3000'
  // eslint-disable-next-line no-prototype-builtins
  if (screenShotTypes.hasOwnProperty(screenShotType)) {
    console.error(
      'Incorrect type in takeCardScreenShot API. Need one of: drivers, teams'
    )
    return
  }
  // set content type to image
  ctx.type = `image/png`
  try {
    const browser = await puppeteer.launch({
      headless: true,
      // https://cri.dev/posts/2020-04-04-Full-list-of-Chromium-Puppeteer-flags/
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-first-run',
        '--no-sandbox',
        '--no-zygote',
        '--deterministic-fetch',
        '--disable-features=IsolateOrigins',
        '--disable-site-isolation-trials',
        '--disable-features=site-per-process',
        '--disable-web-security',
        '--disable-site-isolation-trials',
        '--disable-infobars',
        '--no-first-run',
        '--window-position=0,0',
        '--ignore-certificate-errors',
        '--ignore-certificate-errors-skip-list',
        '--disable-accelerated-2d-canvas',
        '--hide-scrollbars',
        '--disable-notifications',
        '--disable-extensions',
        '--force-color-profile=srgb',
        '--mute-audio',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-breakpad',
        '--disable-component-extensions-with-background-pages',
        '--disable-features=TranslateUI,BlinkGenPropertyTrees,IsolateOrigins,site-per-process',
        '--disable-ipc-flooding-protection',
        '--disable-renderer-backgrounding',
        '--enable-features=NetworkService,NetworkServiceInProcess',
      ],
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
        // url is for internal api to take shot with - not user entered endpoint
        const req = await page.goto(
          `${apiHost}/${screenShotType}/${ctx.params.name_slug}?noNav=true&noToggle=true`
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
          `${apiHost}/${screenShotType}/${ctx.params.name_slug}?noNav=true&noToggle=true`
        )
        if (!utils.statusCodeChecker(req._status)) {
          throw Error(
            `${req._status} error recieved from puppeteer. Check endpoint returns valid res in takeCardScreenShot`
          )
        }
      }
    }
    // determine where to store screenshot
    let imgPath = ''
    if (ctx.request.url.includes('mobile')) {
      if (ctx.request.url.includes('mini')) {
        imgPath = `./API/screenShotsStore/mobile/mini/${ctx.params.name_slug}.png`
      } else {
        imgPath = `./API/screenShotsStore/mobile/${ctx.params.name_slug}.png`
      }
    } else {
      imgPath = `./API/screenShotsStore/web/${ctx.params.name_slug}.png`
    }
    // store screenshots for return
    await page.screenshot({ path: imgPath, fullPage: true })
    await browser.close()
    return await fs.createReadStream(imgPath)
  } catch (e) {
    console.error('An error occured in takeImage:', e)
    return 'An error occured in takeImage:', e
  }
  //   send image to body
}
// takes array of endpoints and get multiuple shots
async function takeCardScreenShots(ctx, urlsToSceenShot) {
  // eslint-disable-next-line no-prototype-builtins
  if (!urlsToSceenShot || !ctx) {
    console.error(
      'takeCardScreenShots error: missing input param. Check inputs are not void.'
    )
    return
  }
  // set content type to image
  ctx.type = `image/png`
  try {
    const browser = await puppeteer.launch({
      headless: true,
      // only use with trusted source
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-first-run',
        '--no-sandbox',
        '--no-zygote',
        '--deterministic-fetch',
        '--disable-features=IsolateOrigins',
        '--disable-site-isolation-trials',
        '--disable-features=site-per-process',
        '--disable-web-security',
        '--disable-site-isolation-trials',
        '--disable-infobars',
        '--no-first-run',
        '--window-position=0,0',
        '--ignore-certificate-errors',
        '--ignore-certificate-errors-skip-list',
        '--disable-accelerated-2d-canvas',
        '--hide-scrollbars',
        '--disable-notifications',
        '--disable-extensions',
        '--force-color-profile=srgb',
        '--mute-audio',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-breakpad',
        '--disable-component-extensions-with-background-pages',
        '--disable-features=TranslateUI,BlinkGenPropertyTrees,IsolateOrigins,site-per-process',
        '--disable-ipc-flooding-protection',
        '--disable-renderer-backgrounding',
        '--enable-features=NetworkService,NetworkServiceInProcess',
      ],
    })
    const page = await browser.newPage()
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
        `http://localhost:3000/${screenShotType}/${ctx.params.name_slug}?noNav=true&noToggle=true`
      )
      if (!utils.statusCodeChecker(req._status)) {
        throw Error(
          `${req._status} error recieved from puppeteer. Check endpoint returns valid res in takeCardScreenShots`
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
        `http://localhost:3000/${screenShotType}/${ctx.params.name_slug}?noNav=true&noToggle=true`
      )
      if (!utils.statusCodeChecker(req._status)) {
        throw Error(
          `${req._status} error recieved from puppeteer. Check endpoint returns valid res in takeCardScreenShots`
        )
      }
    }
    await page.screenshot({ path: 'example.png', fullPage: true })
    await browser.close()
    return fs.createReadStream('./example.png')
  } catch (e) {
    console.error('An error occured in takeImage:', e)
    return 'An error occured in takeImage:', e
  }
  //   send image to body
}
module.exports = {
  takeCardScreenShots,
  takeCardScreenShot,
  sendUserData,
}
