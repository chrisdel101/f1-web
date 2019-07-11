const https = require('https')
const title = 'Formula 1'
module.exports = {
  getDriver: id => {},
  httpCall: url => {
    return new Promise((resolve, reject) => {
      https.get(url, res => {
        res.setEncoding('utf8')
        res.on('data', d => {
          resolve(d)
        })
      })
    })
  },
  render: async (ctx, next) => {
    await ctx.render('index', {
      title: title
    })
  }
}
