const utils = require('../utils')
const fs = require('fs')
var puppeteer = require('puppeteer')

async function sendImage(ctx) {
  // unlink/delete file
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
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    console.log('HERE 1')
    const page = await browser.newPage()
    if (process.env.NODE_ENV === 'development') {
      await page.goto(`http://localhost:3000/driver/${ctx.params.driver_slug}`)
    } else if (process.env.NODE_ENV === 'production') {
      await page.goto(
        `https://f1-cards.herokuapp.com/api/driver/${ctx.params.driver_slug}`
      )
      console.log('HERE 2')
    }
    await page.screenshot({ path: 'example.png' })
    console.log('here 3')
    await browser.close()
    console.log('here 3')
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
  sendImage
}
