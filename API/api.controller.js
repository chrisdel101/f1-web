const utils = require('../utils')
const {
  urls,
  screenShotTypes,
  screenShotSizes,
  cardSizes,
  cardFormats,
} = require('../constants')
const fs = require('fs')
var puppeteer = require('puppeteer')
const { fetchDrivers } = require('../clients/driver.client')
const { fetchTeams } = require('../clients/team.client')

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
  const format = ctx.query?.['format'] || cardFormats.MOBILE
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
    if (screenShotType === screenShotTypes.TEAMS) {
      const format = ctx.query?.['format'] || cardFormats.MOBILE
      if (format === cardFormats.MOBILE) {
        await page.setViewport({
          width: 400,
          height: 600,
          deviceScaleFactor: 1,
        })
        // take full size, shrink with css
      } else if (format === cardFormats.MENU) {
        await page.setViewport({
          width: 1000,
          height: 600,
          deviceScaleFactor: 1,
        })
      } else if (format === cardFormats.WEB) {
        await page.setViewport({
          width: 1000,
          height: 600,
          deviceScaleFactor: 1,
        })
      } else {
        console.error('Invalid card size in API controller')
        return
      }
      // url is for internal api to take shot with - not user entered endpoint
      const req = await page.goto(
        `${apiHost}/${screenShotType}/${ctx.params.name_slug}?noNav=true&noToggle=true$`
      )
      if (!utils.statusCodeChecker(req._status)) {
        throw Error(
          `${req._status} error recieved from puppeteer. Check endpoint returns valid res in takeCardScreenShot`
        )
      }
    } else if (screenShotType === screenShotTypes.DRIVERS) {
      // if (format === cardFormats.MOBILE) {
        await page.setViewport({
          width: 600,
          height: 600,
          deviceScaleFactor: 1,
        })
      //   // take full size, shrink with css
      // } else if (format === cardFormats.MINI) {
      //   await page.setViewport({
      //     width: 900,
      //     height: 600,
      //     deviceScaleFactor: 1,
      //   })
      // } else if (format === cardFormats.FULL) {
      //   await page.setViewport({
      //     width: 900,
      //     height: 600,
      //     deviceScaleFactor: 1,
      //   })
      // } else {
      //   console.error('Invalid card size in API controller')
      //   return
      // }
      const req = await page.goto(
        `${apiHost}/${screenShotType}/${ctx.params.name_slug}?noNav=true&noToggle=true`
      )
      if (!utils.statusCodeChecker(req._status)) {
        throw Error(
          `${req._status} error recieved from puppeteer. Check endpoint returns valid res in takeCardScreenShot`
        )
      }
    }
    // determine where to store screenshot
    let imgPath = ''
    if (ctx.request.url.includes('mobile')) {
      if (ctx.request.url.includes('mini')) {
        imgPath = `./API/screenShotStore/mobile/mini/${screenShotType}/${ctx.params.name_slug}.png`
      } else {
        imgPath = `./API/screenShotStore/mobile/${screenShotType}/${ctx.params.name_slug}.png`
      }
    } else {
      imgPath = `./API/screenShotStore/web/${screenShotType}/${ctx.params.name_slug}.png`
    }
    const example = await page.$('.driver-card');
    const bounding_box = await example.boundingBox();
    // store screenshots for return
    await page.screenshot({ path: imgPath,  
    // clip: {
    //   x: bounding_box.x,
    //   y: bounding_box.y,
    //   width: Math.min(bounding_box.width, page.viewport().width),
    //   height: Math.min(bounding_box.height, page.viewport().height),
    // },
    fullPage: true
  })
    await browser.close()
    return await fs.createReadStream(imgPath)
  } catch (e) {
    console.error('An error occured in takeImage:', e)
    return 'An error occured in takeImage:', e
  }
  //   send image to body
}
// takes obj with viewport dims and arr of urls
async function takeCardScreenShots(screenShotSetData) {
  try {
    // eslint-disable-next-line no-prototype-builtins
    if (!screenShotSetData) {
      console.error(
        'takeCardScreenShots error: missing input param. Check inputs are not void.'
      )
      return
    }
    // https://cri.dev/posts/2020-04-04-Full-list-of-Chromium-Puppeteer-flags/
    const browser = await puppeteer.launch({
      headless: true,
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
    await page.setViewport({
      width: screenShotSetData.viewPortDims.width,
      height: screenShotSetData.viewPortDims.height,
      deviceScaleFactor: screenShotSetData.viewPortDims.deviceScaleFactor,
    })
    let i = 0
    while(screenShotSetData.urlsDataArr[i]){
    // for (let urlDataObj of screenShotSetData.urlsDataArr) {
      const req = await page.goto(screenShotSetData.urlsDataArr[i].url)
      if (!utils.statusCodeChecker(req._status)) {
        throw Error(
          `${req._status} error recieved from puppeteer. Check endpoint returns valid res in takeCardScreenShots`
        )
      } else {
        await page.screenshot({
          path: `${process.cwd()}/${screenShotSetData.folderToSave}/${
            screenShotSetData.urlsDataArr[i].name_slug
          }.png`,
          fullPage: true,
        })
        i++
        console.log('i', i)
      }
    }
    await browser.close()
    return new Promise((resolve, reject) => {
      resolve(1)
      reject('failed')
    })
  } catch (e) {
    console.error('An error occured in takeCardScreenShots:', e)
    throw Error(`'An error occured in takeCardScreenShots: ${e}`)
  }
}
async function buildDriverScreenShotData() {
  try {
    const drivers = await fetchDrivers()
    const driverWebImgs = {
      folderToSave: 'API/screenShotsStore/web/drivers',
      viewPortDims: {
        width: 800,
        height: 800,
        deviceScaleFactor: 1,
      },
      urlsDataArr: drivers.map((driver) => {
        return {
          url: `${urls.localCardsEndpoint}/drivers/${driver.name_slug}?noNav=true&noToggle=true`,
          name_slug: driver.name_slug,
        }
      }),
    }
    const driverMobileImgs = {
      folderToSave: 'API/screenShotsStore/mobile/drivers',
      viewPortDims: {
        width: 600,
        height: 600,
        deviceScaleFactor: 1,
      },
      urlsDataArr: drivers.map((driver) => {
        return {
          url: `${urls.localCardsEndpoint}/drivers/${driver.name_slug}?noNav=true&noToggle=true`,
          name_slug: driver.name_slug,
        }
      }),
    }
    // take full size, shrink w css
    const driverMenuImgs = {
      folderToSave: 'API/screenShotsStore/menu/drivers',
      viewPortDims: {
        width: 900,
        height: 600,
        deviceScaleFactor: 1,
      },
      urlsDataArr: drivers.map((driver) => {
        return {
          url: `${urls.localCardsEndpoint}/drivers/${driver.name_slug}?noNav=true&noToggle=true&layout=select`,
          name_slug: driver.name_slug,
        }
      }),
    }
    return {
      driverWebImgs,
      driverMobileImgs,
      driverMenuImgs,
    }
  } catch (e) {
    console.error('buildDriverScreenShotData error', e)
  }
}
async function buildTeamScreenShotData() {
  const teams = await fetchTeams()
  const teamWebImgs = {
    folderToSave: 'API/screenShotsStore/web/teams',
    viewPortDims: {
      width: 1000,
      height: 600,
      deviceScaleFactor: 1,
    },
    urlsDataArr: teams.map((team) => {
      return {
        url: `${urls.localCardsEndpoint}/teams/${team.name_slug}?noNav=true&noToggle=true&layout=stats`,
        name_slug: team.name_slug,
      }
    }),
  }
  const teamMobileImgs = {
    folderToSave: 'API/screenShotsStore/mobile/teams',
    viewPortDims: {
      width: 400,
      height: 600,
      deviceScaleFactor: 1,
    },
    urlsDataArr: teams.map((team) => {
      return {
        url: `${urls.localCardsEndpoint}/teams/${team.name_slug}?noNav=true&noToggle=true&layout=stats`,
        name_slug: team.name_slug,
      }
    }),
  }
  // take full size, shrink with css
  // make sure it's a square
  const teamMenuImgs = {
    folderToSave: 'API/screenShotsStore/menu/teams',
    viewPortDims: {
      width: 800,
      height: 800,
      deviceScaleFactor: 1,
    },
    urlsDataArr: teams.map((team) => {
      return {
        url: `${urls.localCardsEndpoint}/teams/${team.name_slug}?noNav=true&noToggle=true&layout=select`,
        name_slug: team.name_slug,
      }
    }),
  }
  return {
    teamWebImgs,
    teamMobileImgs,
    teamMenuImgs,
  }
}
async function takeAllPreRunScreenShots(ctx) {
  try {
    // type is drivers or teams
    const type = ctx.query['type']
    const { teamWebImgs, teamMobileImgs, teamMenuImgs } =
      await buildTeamScreenShotData()
    const { driverWebImgs, driverMobileImgs, driverMenuImgs } =
      await buildDriverScreenShotData()
    // run conditionals and store funcs to call
    let screenShotDataSets = {}
    if (ctx.query['type']) {
      // if invalid type param default to both
      if (!utils.objValueExists(screenShotTypes, ctx.query['type'])) {
        screenShotDataSets = {
          teamWebImgs,
          teamMobileImgs,
          teamMenuImgs,
        }
        // spread above in first to avoid overwriting
        screenShotDataSets = {
          ...screenShotDataSets,
          driverWebImgs,
          driverMobileImgs,
          driverMenuImgs,
        }
        // both
      } else if (ctx.query['type'] === screenShotTypes.DRIVERS) {
        // drivers
        screenShotDataSets = {
          driverWebImgs,
          driverMobileImgs,
          driverMenuImgs,
        }
      } else if (ctx.query['type'] === screenShotTypes.TEAMS) {
        // teams
        screenShotDataSets = {
          teamWebImgs,
          teamMobileImgs,
          teamMenuImgs,
        }
      }
    } else {
      // if no type add all build sets
      screenShotDataSets = {
        teamWebImgs,
        teamMobileImgs,
        teamMenuImgs,
      }
      // spread above in first to avoid overwriting
      screenShotDataSets = {
        ...screenShotDataSets,
        driverWebImgs,
        driverMobileImgs,
        driverMenuImgs,
      }
    }
    // screenShotDataSets hold all the type sets at this point
    if (ctx.query['format']) {
      console.log('FORMAT', ctx.query['format'])
      // if invalid format param default to web
      if (
        !utils.objValueExists(cardFormats, ctx.query['format']) ||
        ctx.query['format'] === cardFormats.WEB
      ) {
        // remove all expect full sizes
        const validKeys = ['fullDriverImgs', 'fullTeamImgs']
        screenShotDataSets = utils.delAllObjExcept(
          screenShotDataSets,
          validKeys
        )
      } else if (ctx.query['format'] === cardFormats.MOBILE) {
        // remove all expect mobile sizes
        const validKeys = ['teamMobileImgs', 'driverMobileImgs']
        screenShotDataSets = utils.delAllObjExcept(
          screenShotDataSets,
          validKeys
        )
      } else if (ctx.query['format'] === cardFormats.MENU) {
        // remove all expect mini sizes
        const validKeys = ['teamMenuImgs', 'driverMenuImgs']
        screenShotDataSets = utils.delAllObjExcept(
          screenShotDataSets,
          validKeys
        )
      }
       // run with any type params or all
       let i = 0
       const sets = Object.keys(screenShotDataSets)
     //  run each full set before calling next
       while(sets[i]){
         let key = sets[i]
         const resPromise = await takeCardScreenShots(screenShotDataSets[key])
         // update i from promise
         i += await resPromise
       }
       return ctx.body = 'complete'
    } else {
      // run with any type params or all
      let i = 0
      const sets = Object.keys(screenShotDataSets)
    //  run each full set before calling next
      while(sets[i]){
        let key = sets[i]
        const resPromise = await takeCardScreenShots(screenShotDataSets[key])
        // update i from promise
        i += await resPromise
      }
      return ctx.body = 'complete'
    }
  } catch (e) {
    console.error('takeAllPreRunScreenShots error', e)
    return ctx.body = 'failed'
  }
}
function returnImage(ctx, screenShotType) {
  try {
    const params = ctx.params?.['name_slug']
    const format = ctx.query?.['format'] || cardFormats.MOBILE
    if (!utils.objValueExists(screenShotTypes, screenShotType)) {
      console.error(
        `Invalid screenshot type ${screenShotType} requested in apiController returnImage`
      )
      return
    }
    if (!utils.objValueExists(cardFormats, format)) {
      console.error(
        `Invalid cardFormat ${format} requested in apiController returnImage`
      )
      return
    }
    const path = `API/screenShotsStore/${format}/${screenShotType}/${params}.png`
    return fs.createReadStream(path)
  } catch (e) {
    console.error('An error occured in returnImage', e)
  }
}

module.exports = {
  takeCardScreenShots,
  takeCardScreenShot,
  sendUserData,
  buildDriverScreenShotData,
  buildTeamScreenShotData,
  takeAllPreRunScreenShots,
  returnImage,
}
