const router = require('koa-router')()
const indexController = require('../controllers/index.controller')
const driversController = require('../controllers/drivers.controller')
const teamsController = require('../controllers/teams.controller')
const API = require('../API/index')
const fs = require('fs')
const puppeteer = require('puppeteer')


router.get('/', indexController.render)
router.get('/driver', driversController.renderDriverTemplate)
router.get('/team', teamsController.fetchTeam)
router.get('/driver/:driver_slug', driversController.renderDriverCard)
router.get('/api/driver/:driver_slug', () =>{
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
