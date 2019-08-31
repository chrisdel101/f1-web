const utils = require('../utils')
const send = require('koa-send')
const fs = require('fs')
async function sendImage(ctx) {
  // take image
  await utils.takeImage(ctx)
  console.log('CTX', ctx.res)
  ctx.type = `image/png`
  ctx.body = fs.createReadStream(
    '/Users/chrisdielschnieder/desktop/code_work/formula1/f1Web/example.png'
  )
  // grab image
  //   return ctx
}
module.exports = {
  sendImage
}
