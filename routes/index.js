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
router.get('/api/driver/:driver_slug', async ctx => {
  try {
    fs.access('example.png', err => {
      if (!err) {
        console.log('myfile exists')
        fs.unlink('./example.png', err => {
          if (err) throw err
          console.log('File unlinked')
        })
      } else {
        console.log('myfile does not exist')
      }
    })
  } catch (err) {
    console.error('No Example.png file exists', err)
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
  console.log('Image snapped')
  await browser.close()

  ctx.type = `image/png`
  //   send image to body
  ctx.body = fs.createReadStream('./example.png')
})
router.get('/test/:driver_slug', async ctx => {
  const image = await API.sendImage(ctx, ctx.params.driver_slug)
  console.log('image', image)
  ctx.body = image
})
module.exports = router
