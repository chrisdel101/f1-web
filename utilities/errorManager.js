exports.indexControllerErrors = {
  renderDemoError: (ctx, driverNamesArr, teamsNamesArr) => {
    console.log(driverNamesArr, teamsNamesArr)
    if (!driverNamesArr?.length || !teamsNamesArr?.length) {
      ctx.body = 'renderDemo data missing'
      throw new ReferenceError('renderDriverTemplate data is missing')
    }
  },
}
