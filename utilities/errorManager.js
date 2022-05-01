exports.indexControllerErrors = {
  renderDemoError: (ctx, driverNamesArr, teamsNamesArr) => {
    console.log(driverNamesArr, teamsNamesArr)
    if (!driverNamesArr?.length || !teamsNamesArr?.length) {
      ctx.body = 'renderDemo data missing'
      throw new ReferenceError('Error: renderDriverTemplate data is missing')
    }
  },
  queryDriverDataError: (ctx, driverData, teamData) => {
    if (!driverData || !teamData) {
      ctx.body = 'queryDriverDataError data missing'
      throw new ReferenceError(
        'queryDriverDataError: queried driver data is undefined'
      )
    }
  },
  queryTeamDataError: (ctx, teamData) => {
    if (!teamData) {
      ctx.body = 'queryTeamDataError data missing'
      throw new ReferenceError(
        'queryTeamDataError: queried team data is undefined'
      )
    }
  },
}
