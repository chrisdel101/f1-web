const utils = require('../utils')
const {
  urls,
  screenShotTypes,
  screenShotSizes,
  cardSizes,
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
      const size = ctx.query?.['size'] || cardSizes.MOBILE
      if (size === cardSizes.MOBILE) {
        await page.setViewport({
          width: 400,
          height: 600,
          deviceScaleFactor: 1,
        })
        // take full size, shrink with css
      } else if (size === cardSizes.MINI) {
        await page.setViewport({
          width: 1000,
          height: 600,
          deviceScaleFactor: 1,
        })
      } else if (size === cardSizes.FULL) {
        await page.setViewport({
          width: 1000,
          height: 600,
          deviceScaleFactor: 1,
        })
      } else {
        console.error('Invalid card size in API controller')
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
      if (size === cardSizes.MOBILE) {
        await page.setViewport({
          width: 600,
          height: 600,
          deviceScaleFactor: 1,
        })
        // take full size, shrink with css
      } else if (size === cardSizes.MINI) {
        await page.setViewport({
          width: 900,
          height: 600,
          deviceScaleFactor: 1,
        })
      } else if (size === cardSizes.FULL) {
        await page.setViewport({
          width: 900,
          height: 600,
          deviceScaleFactor: 1,
        })
      } else {
        console.error('Invalid card size in API controller')
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
    // determine where to store screenshot
    let imgPath = ''
    if (ctx.request.url.includes('mobile')) {
      if (ctx.request.url.includes('mini')) {
        imgPath = `./API/screenShotsStore/mobile/mini/${ctx.params.name_slug}.png`
      } else {
        imgPath = `./API/screenShotsStore/mobile/${ctx.params.name_slug}.png`
      }
    } else {
      imgPath = `./API/screenShotsStore/full/${ctx.params.name_slug}.png`
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
// takes obj with viewport dims and arr of urls
async function takeCardScreenShots(screenShotSetData) {
  console.log('TOP', screenShotSetData)
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
    for (let urlDataObj of screenShotSetData.urlsDataArr) {
      const req = await page.goto(urlDataObj.url)
      if (!utils.statusCodeChecker(req._status)) {
        throw Error(
          `${req._status} error recieved from puppeteer. Check endpoint returns valid res in takeCardScreenShots`
        )
      } else {
        await page.screenshot({
          path: `${process.cwd()}/${screenShotSetData.folderToSave}/${
            urlDataObj.name_slug
          }.png`,
          fullPage: true,
        })
      }
    }
    await browser.close()
  } catch (e) {
    console.error('An error occured in takeImage:', e)
    throw Error(`'An error occured in takeImage: ${e}`)
  }
}
async function buildDriverScreenShotData() {
  try {
    const drivers = await fetchDrivers()
    const driverFullImgs = {
      folderToSave: 'API/screenShotsStore/full/drivers',
      viewPortDims: {
        width: 900,
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
    const driverMiniImgs = {
      folderToSave: 'API/screenShotsStore/mini/drivers',
      viewPortDims: {
        width: 900,
        height: 600,
        deviceScaleFactor: 1,
      },
      urlsDataArr: drivers.map((driver) => {
        return {
          url: `${urls.localCardsEndpoint}/drivers/${driver.name_slug}?noNav=true&noToggle=true&size=mini`,
          name_slug: driver.name_slug,
        }
      }),
    }
    return {
      driverFullImgs,
      driverMobileImgs,
      driverMiniImgs,
    }
  } catch (e) {
    console.error('buildDriverScreenShotData error', e)
  }
}
async function buildTeamScreenShotData() {
  const teams = await fetchTeams()
  const teamFullImgs = {
    folderToSave: 'API/screenShotsStore/full/teams',
    viewPortDims: {
      width: 1000,
      height: 600,
      deviceScaleFactor: 1,
    },
    urlsDataArr: teams.map((team) => {
      return {
        url: `${urls.localCardsEndpoint}/teams/${team.name_slug}?noNav=true&noToggle=true&format=stats`,
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
        url: `${urls.localCardsEndpoint}/teams/${team.name_slug}?noNav=true&noToggle=true&format=stats`,
        name_slug: team.name_slug,
      }
    }),
  }
  // take full size, shrink with css
  const teamMiniImgs = {
    folderToSave: 'API/screenShotsStore/mini/teams',
    viewPortDims: {
      width: 1000,
      height: 600,
      deviceScaleFactor: 1,
    },
    urlsDataArr: teams.map((team) => {
      return {
        url: `${urls.localCardsEndpoint}/teams/${team.name_slug}?noNav=true&noToggle=true&format=select`,
        name_slug: team.name_slug,
      }
    }),
  }
  return {
    teamFullImgs,
    teamMobileImgs,
    teamMiniImgs,
  }
}
async function takeAllPreRunScreenShots(ctx) {
  try {
    const type = ctx.query['type']
    const { teamFullImgs, teamMobileImgs, teamMiniImgs } =
      await buildTeamScreenShotData()
    const { driverFullImgs, driverMobileImgs, driverMiniImgs } =
      await buildDriverScreenShotData()
    // run conditionals and store funcs to call
    let screenShotDataSets = {}
    if (ctx.query['type']) {
      // if invalid type param default to both
      if (!utils.objValueExists(screenShotTypes, ctx.query['type'])) {
        screenShotDataSets = {
          teamFullImgs,
          teamMobileImgs,
          teamMiniImgs,
        }
        // spread above in first to avoid overwriting
        screenShotDataSets = {
          ...screenShotDataSets,
          driverFullImgs,
          driverMobileImgs,
          driverMiniImgs,
        }
        // both
      } else if (ctx.query['type'] === screenShotTypes.DRIVERS) {
        // drivers
        screenShotDataSets = {
          driverFullImgs,
          driverMobileImgs,
          driverMiniImgs,
        }
      } else if (ctx.query['type'] === screenShotTypes.TEAMS) {
        // teams
        screenShotDataSets = {
          teamFullImgs,
          teamMobileImgs,
          teamMiniImgs,
        }
      }
    } else {
      // if no type add all build sets
      screenShotDataSets = {
        teamFullImgs,
        teamMobileImgs,
        teamMiniImgs,
      }
      // spread above in first to avoid overwriting
      screenShotDataSets = {
        ...screenShotDataSets,
        driverFullImgs,
        driverMobileImgs,
        driverMiniImgs,
      }
    }
    // screenShotDataSets hold all the type sets at this point
    if (ctx.query['size']) {
      console.log('HERE', ctx.query['size'])
      // if invalid size param default to full
      if (
        !utils.objValueExists(screenShotSizes, ctx.query['size']) ||
        ctx.query['size'] === screenShotSizes.FULL
      ) {
        // remove all expect full sizes
        const validKeys = ['fullDriverImgs', 'fullTeamImgs']
        screenShotDataSets = utils.delAllObjExcept(
          screenShotDataSets,
          validKeys
        )
      } else if (ctx.query['size'] === screenShotSizes.MOBILE) {
        // remove all expect mobile sizes
        const validKeys = ['teamMobileImgs', 'driverMobileImgs']
        screenShotDataSets = utils.delAllObjExcept(
          screenShotDataSets,
          validKeys
        )
      } else if (ctx.query['size'] === screenShotSizes.MINI) {
        // remove all expect mini sizes
        const validKeys = ['teamMiniImgs', 'driverMiniImgs']
        screenShotDataSets = utils.delAllObjExcept(
          screenShotDataSets,
          validKeys
        )
      }
      // loop over screenShotDataSets remainaing and pass to takeCardScreenShots
      return Object.keys(screenShotDataSets).forEach(async (dataSetKey) => {
        await takeCardScreenShots(screenShotDataSets[dataSetKey])
      })
    } else {
      // run with any type params or all
      Object.keys(screenShotDataSets).forEach(async (dataSetKey) => {
        console.log(
          'screenShotDataSets[dataSetKey]',
          screenShotDataSets[dataSetKey]
        )
        await takeCardScreenShots(screenShotDataSets[dataSetKey])
      })
    }
  } catch (e) {
    console.error('takeAllPreRunScreenShots error', e)
  }
}
function returnImage(ctx, screenShotType) {
  try {
    const params = ctx.params?.['name_slug']
    const size = ctx.query?.['size']
    if (!utils.objValueExists(screenShotTypes, screenShotType)) {
      console.error(
        `Invalid screenshot type ${screenShotType} requested in apiController returnImage`
      )
      return
    }
    if (!utils.objValueExists(screenShotSizes, size)) {
      console.error(
        `Invalid screenshot size ${size} requested in apiController returnImage`
      )
      return
    }
    const path = `API/screenShotsStore/${size}/${screenShotType}/${params}.png`
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
