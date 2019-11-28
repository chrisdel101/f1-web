module.exports = {
  localCardsEndpoint: `http://localhost:3000`,
  prodCardsEndpoint: `https://f1-cards.herokuapp.com`,
  localDev: params => {
    return `http://localhost:5000/${params}`
  },
  prodUrl: params => {
    return ` https://f1-api.herokuapp.com/${params}`
  }
}
