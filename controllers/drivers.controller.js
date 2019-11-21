const utils = require("../utils")
const cache = require("../cache")
const cacheController = require("./cache.controller")

module.exports = {
  compileDriverTemplateResObj,
  fetchDriverAPI,
  fetchDriversAPI,
  renderDriverTemplate,
  renderDriverCard,
  renderAllDriversList,
  makeAllDriversObjs
}
function compileDriverTemplateResObj(
  ctx,
  driversObj,
  teamsObj,
  driverData,
  teamData
) {
  // call team endpoint
  const teamUrl = `/team?team=${driverData.team_name_slug}`
  // add link to team to driver
  driverData["teamUrl"] = teamUrl
  driverData["logo_url"] = teamData.logo_url

  return {
    //  +++ index params +++
    urls: ctx.urls,
    method: "GET",
    title: ctx.title,
    driverAction: driversObj.driverAction,
    teamAction: teamsObj.teamAction,
    buttonField: "Submit",
    buttonType: "submit",
    buttonValue: "submit",
    driverSelectName: driversObj.selectName,
    driverEnums: driversObj.driversArr,
    teamSelectName: teamsObj.selectName,
    teamEnums: teamsObj.teamsArr,
    driverFormText: ctx.driverFormText,
    teamFormText: ctx.teamFormText,
    // +++ mixin data  +++
    routeName: "driver",
    driverData: driverData,
    teamData: teamData,
    allData: { ...driverData, ...teamData }
  }
}

// fetchs the driver info from the api to use in render func
async function fetchDriverAPI(ctx, render, driverSlug = undefined) {
  try {
    // get the input params diff depending on type
    if (render === "page") {
      // get query params from GET req
      driverSlug = ctx.query.driver
    } else if (render === "card") {
      driverSlug = ctx.params.driver_slug
    }
    if (!driverSlug) {
      throw new ReferenceError("fetchDriverAPI must have driver_slug")
    }
    // query driver by slug
    const driverData = JSON.parse(
      await utils.fetchData(`drivers/${driverSlug}`)
    )
    console.log(driverData)
    // look up drivers team by id
    let teamData = JSON.parse(
      await utils.fetchData(`teams/${driverData.team_id}`)
    )
    // if id fails use slug
    if (!teamData) {
      console.log("dd", `teams/${driverData.team_name_slug}`)
      teamData = JSON.parse(
        await utils.fetchData(`teams/${driverData.team_name_slug}`)
      )
    }
    return {
      driverData,
      teamData
    }
  } catch (e) {
    console.error("An error in driverController.fetchDriverAPI()", e)
  }
}
// fetchs the driver info from the api to use in render func
async function fetchDriversAPI() {
  try {
    const driversObj = await cacheController.handleDriversCache(cache, 1440)
    const teamsObj = await cacheController.handleTeamsCache(cache, 1440)
    return {
      driversObj,
      teamsObj
    }
  } catch (e) {
    console.error("An error in driverController.fetchDriversAPI()", e)
  }
}
// takes slug, calls API and combines props
async function makeAllDriversObjs(ctx, driverSlug, size = "full") {
  try {
    // add size to options for css class styles
    if (ctx.query.size === "mini") {
      size = "mini"
    }
    const { driverData } = await module.exports.fetchDriverAPI(
      ctx,
      null,
      driverSlug
    )
    const options = {
      driver_name: driverData.driver_name,
      flag_img_url: driverData.flag_img_url,
      main_image: driverData.main_image,
      name_slug: driverData.name_slug,
      size
    }
    return options
  } catch (e) {
    console.error("Error in makeAllDriversObjs", e)
  }
}
// calls all drivers, fetchs makeAllDriversObjs, and renders tmplt
async function renderAllDriversList(ctx) {
  try {
    // must have module.exports to work in tests
    const { driversObj } = await module.exports.fetchDriversAPI()
    // allDriversObj contain partial info for allDriversPage
    const allDriverObjs = async () => {
      const promises = driversObj.driversArr.map(async driver => {
        return await module.exports.makeAllDriversObjs(ctx, driver.name_slug)
      })
      return Promise.all(promises)
    }
    const driversArr = await allDriverObjs()
    // needs to have key name to work in template
    const driversArrObj = {
      driversArr,
      size: driversArr[0].size
    }
    return await ctx.render("allDrivers", driversArrObj)
  } catch (e) {
    console.error("Error in renderAllDriversList", e)
  }
}
// use driver api data to rendercard only
async function renderDriverCard(ctx) {
  try {
    const { driverData, teamData } = await fetchDriverAPI(ctx, "card")

    const teamUrl = `/team?team=${driverData.team_name_slug}`
    // add link to team to driver
    driverData["teamUrl"] = teamUrl
    driverData["logo_url"] = teamData.logo_url
    // console.log('Driver Data', driverData)
    return await ctx.render("driverPage", {
      //  +++ index params +++
      urls: ctx.urls,
      method: "GET",
      addClass: "driver-card-page",
      routeName: "driverCard",
      driverData: driverData,
      teamData: teamData
    })
  } catch (e) {
    console.error("An error in renderDriverCard", e)
  }
}
// use driver api data to render full template
async function renderDriverTemplate(ctx) {
  const { driverData, teamData } = await module.exports.fetchDriverAPI(
    ctx,
    "page"
  )
  const { driversObj, teamsObj } = await module.exports.fetchDriversAPI()
  // console.log(driverData)
  if (!driverData) {
    throw new ReferenceError("renderDriverTemplate.driverData() is undefined")
  } else if (!teamData) {
    throw new ReferenceError("renderDriverTemplate.teamData() is undefined")
  } else if (!driversObj) {
    throw new ReferenceError("renderDriverTemplate.driversObj() is undefined")
  } else if (!teamsObj) {
    throw new ReferenceError("renderDriverTemplate.teamsObj() is undefined")
  }

  const options = module.exports.compileDriverTemplateResObj(
    ctx,
    driversObj,
    teamsObj,
    driverData,
    teamData
  )
  // console.log(options)
  return await ctx.render("driverPage", options)
}
