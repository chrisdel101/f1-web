module.exports = {
  urls: {
    localCardsEndpoint: `http://localhost:3000`,
    prodCardsEndpoint: `https://f1-cards.herokuapp.com`,
    localF1: (params) => {
      return `${'http://127.0.0.1:5000' || 'http://localhost:5000'}/${params}`
    },
    prodF1: (params) => {
      return ` https://f1-api.herokuapp.com/${params}`
    },
  },
  indexBackgroundUrls: [
    'https://res.cloudinary.com/chris-del/image/upload/v1651956073/f1-cards/shawnanggg-rHx28bnBwjE-unsplash_2_1.jpg',
    'https://res.cloudinary.com/chris-del/image/upload/v1651956072/f1-cards/hanson-lu-QV0AinhRU2c-unsplash_1_1.jpg',
    'https://res.cloudinary.com/chris-del/image/upload/v1651956072/f1-cards/patrick-robert-doyle-pm_CmPSl25U-unsplash_1_1.jpg',
    'https://res.cloudinary.com/chris-del/image/upload/v1651956072/f1-cards/gustavo-campos-B87zMorEZRo-unsplash_1_1.jpg',
    'https://res.cloudinary.com/chris-del/image/upload/v1651956071/f1-cards/abed-ismail-pBUMdQ3Q_C8-unsplash-min.jpg',
    'https://res.cloudinary.com/chris-del/image/upload/v1651956072/f1-cards/luis-jose-torrealba-E3PiwZJ8i1M-unsplash-min.jpg',
    'https://res.cloudinary.com/chris-del/image/upload/v1651956071/f1-cards/glen-wheeler-gN3oQVVJDYo-unsplash-min.jpg',
    'https://res.cloudinary.com/chris-del/image/upload/v1651956071/f1-cards/tim-carey-QhK_agWFAsE-unsplash-min.jpg',
  ],
}
