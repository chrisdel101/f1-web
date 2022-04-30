module.exports = {
  localCardsEndpoint: `http://localhost:3000`,
  prodCardsEndpoint: `https://f1-cards.herokuapp.com`,
  localF1: (params) => {
    return `${'http://127.0.0.1:5000' || 'http://localhost:5000'}/${params}`
  },
  prodF1: (params) => {
    return ` https://f1-api.herokuapp.com/${params}`
  },
}
