module.exports = {
  cardsEndpoint: `http://localhost:3000`,
  localDev: params => {
    return `http://localhost:5000/${params}`
  },
  prodUrl: params => {
    return ` https://f1-api.herokuapp.com/${params}`
  }
}
