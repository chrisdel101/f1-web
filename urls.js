module.exports = {
  localDev: params => {
    return `http://localhost:5000/${params}`
  },
  prodUrl: params => {
    return ` https://f1-api.herokuapp.com/${params}`
  }
}
