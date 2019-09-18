const utils = require('../utils')
const fs = require('fs')
var puppeteer = require('puppeteer')

// send image when called to messenger
async function sendImage(ctx, type) {
  const types = ['driver', 'team']
  if (!types.includes(type)) {
    console.error('Incorrect type in sendImage API')
    return
  }
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
    const page = await browser.newPage()
    if (process.env.NODE_ENV === 'development') {
      if (type === 'team') {
        await page.goto(`http://localhost:3000/${type}/${ctx.params.team_slug}`)
      } else if (type === 'driver') {
        await page.goto(
          `http://localhost:3000/${type}/${ctx.params.driver_slug}`
        )
      }
    } else if (process.env.NODE_ENV === 'production') {
      if (type === 'team') {
        await page.goto(
          `https://f1-cards.herokuapp.com/${type}/${ctx.params.team_slug}`
        )
      } else if (type === 'driver') {
        await page.goto(
          `https://f1-cards.herokuapp.com/${type}/${ctx.params.driver_slug}`
        )
      }
    }
    await page.screenshot({ path: 'example.png' })
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
  sendImage
}
