var router = require('koa-router')()
var indexController = require('../controllers/index.controller')
var driversController = require('../controllers/drivers.controller')
var teamsController = require('../controllers/teams.controller')
var API = require('../API/index')
var fs = require('fs')
var puppeteer = require('puppeteer')

router.get('/', indexController.render)
router.get('/driver', driversController.renderDriverTemplate)
router.get('/team', teamsController.fetchTeam)
router.get('/driver/:driver_slug', driversController.renderDriverCard)
router.get('/api/driver/:driver_slug', API.sendImage)

router.get('/test', async ctx => {
  try {
    if (fs.existsSync('./example.png')) {
      fs.unlinkSync('./example.png')
      console.log('Old Image was removed')
    } else {
      console.log('Old Image not removed')
    }
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    const page = await browser.newPage()
    await page.goto('https://example.com')
    await page.screenshot({ path: 'example.png' })

    await browser.close()
    try {
      if (fs.existsSync('./example.png')) {
        console.log('Image was taken')
        ctx.type = `image/png`
        //   send image to body
        ctx.body = fs.createReadStream('./example.png')
      } else {
        console.log('Image not taken')
      }
    } catch (err) {
      console.error(err)
    }
  } catch (e) {
    console.error('An error in take image', e)
  }
})
router.get('/:driver_slug', async ctx => {
  try {
    if (fs.existsSync('./example.png')) {
      fs.unlinkSync('./example.png')
      console.log('Old Image was removed')
    } else {
      console.log('Old Image not removed')
    }
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    const page = await browser.newPage()
    if (process.env.NODE_ENV === 'development') {
      console.log('here')
      await page.goto(`http://localhost:3000/driver/${ctx.params.driver_slug}`)
    } else if (process.env.NODE_ENV === 'production') {
      await page.goto(
        `https://f1-cards.herokuapp.com/driver/${ctx.params.driver_slug}`
      )
    }
    await page.screenshot({ path: 'example.png' })

    await browser.close()
    try {
      if (fs.existsSync('./example.png')) {
        console.log('Image was taken')
        ctx.type = `image/png`
        //   send image to body
        ctx.body = fs.createReadStream('./example.png')
      } else {
        console.log('Image not taken')
      }
    } catch (err) {
      console.error(err)
    }
  } catch (e) {
    console.error('An error in take image', e)
  }
})
module.exports = router
