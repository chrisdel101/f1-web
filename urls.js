module.exports = {
  f1driverImage: name => {
    return `https://www.formula1.com/content/fom-website/en/drivers/${name}/_jcr_content/image.img.1536.medium.jpg`
  },
  f1carImage: name => {
    return `https://www.formula1.com/content/fom-website/en/teams/${name}/_jcr_content/image16x9.img.1536.medium.jpg/1561122939027.jpg`
  },
  f1API: apiKey => {
    return `https://api.sportradar.us/formula1/trial/v2/en/sport_events/sr:stage:324771/summary.json?api_key=${apiKey}`
  }
}
