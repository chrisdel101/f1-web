const router = require("koa-router")()
const indexController = require("../controllers/index.controller")
const driversController = require("../controllers/drivers.controller")
const teamsController = require("../controllers/teams.controller")
const utils = require("../utils")
const API = require("../API/index")

// cache related
router.get("/reset-cache", utils.resetCache)
router.get("/view-cache", utils.viewCache)
router.get("/fresh-fetch", indexController.freshFetch)
// ---------templates
router.get("/", indexController.renderIndex)
router.get("/demo", indexController.renderDemo)
router.get("/teams", teamsController.renderAllTeamsList)
router.get("/drivers", driversController.renderAllDriversList)
// render full template with query params- like POST
router.get("/driver", driversController.renderDriverTemplate)
router.get("/team", teamsController.renderTeamTemplate)
// render cards
router.get("/driver/:driver_slug", driversController.renderDriverCard)
router.get("/team/:team_slug", teamsController.renderTeamCard)
// API - take images of cards
//---- get arrays from msg webviews
router.post("/drivers", ctx => {
  console.log("drivers", ctx.request.body)
})
router.post("/teams", ctx => {
  console.log(ctx.request.body)
})
// moblie size - uses puppeteer viewport to get
router.get("/api/mobile/driver/:driver_slug", async ctx => {
  return API.sendImagetoMsgr(ctx, "driver").then(res => {
    return (ctx.body = res)
  })
})
router.get("/api/mobile/team/:team_slug", async ctx => {
  return API.sendImagetoMsgr(ctx, "team").then(res => {
    return (ctx.body = res)
  })
})
router.get("/api/driver/:driver_slug", async ctx => {
  return API.sendImagetoMsgr(ctx, "driver").then(res => {
    return (ctx.body = res)
  })
})
router.get("/api/team/:team_slug", async ctx => {
  return API.sendImagetoMsgr(ctx, "team").then(res => {
    return (ctx.body = res)
  })
})
router.get("/test/:driver_slug", async ctx => {
  const image = await API.sendImagetoMsgr(ctx, ctx.params.driver_slug)
  console.log("image", image)
  ctx.body = image
})
module.exports = router
