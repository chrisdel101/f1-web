const cache = require('../cache')
const cacheController = require('./cache.controller')
const { carouselImages } = require('../constants')
module.exports = {
  renderIndex,
  cache,
  freshFetch,
}

async function renderIndex(ctx) {
  await ctx.render('index', {
    subTitle: ctx.subTitle2,
    carouselImages,
  })
}
// fetch from DB manually - skip cache
async function freshFetch() {
  console.log('reset')
  try {
    await module.exports.cacheController.handleDriversCache(true)
    await module.exports.cacheController.handleTeamsCache(true)
    console.log('freshFetch')
  } catch (e) {
    console.log('error in freshFetch', e)
  }
}
