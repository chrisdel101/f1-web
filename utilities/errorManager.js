exports.errorHandler = {
  renderDemoError: (driverNamesArr, teamsNamesArr) => {
    console.log(driverNamesArr, teamsNamesArr)
    if (!driverNamesArr?.length || !teamsNamesArr?.length) {
      throw new ReferenceError('Error: renderDemoError is missing data')
    }
  },
  queryDriverDataError: (driverData, teamData) => {
    if (!driverData || !teamData) {
      throw new ReferenceError('queryDriverDataError: driver data is undefined')
    }
  },
  queryTeamDataError: (teamData) => {
    if (!teamData) {
      throw new ReferenceError(
        'queryTeamDataError: queried team data is undefined'
      )
    }
  },
}
