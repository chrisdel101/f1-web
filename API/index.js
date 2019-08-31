const utils = require('../utils')
const send = require('koa-send')
const fs = require('fs')

async function sendImage(ctx) {
  // take image
  await utils.takeImage(ctx)
  //   set content type to image
  ctx.type = `image/png`
  //   send image to body
  ctx.body = fs.createReadStream('./example.png')
  //   unlink/delete file
  fs.unlink('./example.png', err => {
    if (err) throw err
    console.log('path/file.txt was deleted')
  })
}
module.exports = {
  sendImage
}
