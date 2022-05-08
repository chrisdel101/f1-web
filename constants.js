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
  indexBackgrouundImages: {
    breakPoint2: [
      {
        src: 'https://res.cloudinary.com/chris-del/image/upload/v1651983865/f1-cards/576/shawnanggg-rHx28bnBwjE-unsplash_2_1.jpg',
        cite: 'Photo credit: https://unsplash.com/@shawnanggg?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText',
      },
      {
        src: 'https://res.cloudinary.com/chris-del/image/upload/v1651983864/f1-cards/576/hanson-lu-QV0AinhRU2c-unsplash_1_1.jpg',
        cite: 'Photo credit: https://unsplash.com/@hansonluu?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText',
      },
      {
        src: 'https://res.cloudinary.com/chris-del/image/upload/v1651983865/f1-cards/576/patrick-robert-doyle-pm_CmPSl25U-unsplash_1_1.jpg',
        cite: 'Photo credit: https://unsplash.com/@teapowered?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText',
      },
      {
        src: 'https://res.cloudinary.com/chris-del/image/upload/v1651983864/f1-cards/576/gustavo-campos-B87zMorEZRo-unsplash_1_1.jpg',
        cite: 'Photo credit: https://unsplash.com/@gustavocpo?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText',
      },
      {
        src: 'https://res.cloudinary.com/chris-del/image/upload/v1651983864/f1-cards/576/abed-ismail-pBUMdQ3Q_C8-unsplash-min.jpg',
        cite: 'Photo credit: https://unsplash.com/@abedismail?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText',
      },
      {
        src: 'https://res.cloudinary.com/chris-del/image/upload/v1651983864/f1-cards/576/luis-jose-torrealba-E3PiwZJ8i1M-unsplash-min.jpg',
        cite: 'Photo credit: https://unsplash.com/@luisjoset?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText',
      },
      {
        src: 'https://res.cloudinary.com/chris-del/image/upload/v1651983864/f1-cards/576/glen-wheeler-gN3oQVVJDYo-unsplash-min.jpg',
        cite: 'Photo credit: https://unsplash.com/@glenwheeler?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText',
      },
      {
        src: 'https://res.cloudinary.com/chris-del/image/upload/v1651983865/f1-cards/576/tim-carey-QhK_agWFAsE-unsplash-min.jpg',
        cite: 'Photo credit: https://unsplash.com/@baudy?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText',
      },
    ],

    // {
    //   src: 'https://res.cloudinary.com/chris-del/image/upload/v1651977705/f1-cards/shawnanggg-rHx28bnBwjE-unsplash_2_1.jpg',
    //   cite: 'Photo credit: https://unsplash.com/@shawnanggg?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText',
    // },
    // {
    //   src: 'https://res.cloudinary.com/chris-del/image/upload/v1651980536/f1-cards/hanson-lu-QV0AinhRU2c-unsplash_1_1.jpg',
    //   cite: 'Photo credit: https://unsplash.com/@hansonluu?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText',
    // },
    // {
    //   src: 'https://res.cloudinary.com/chris-del/image/upload/v1651956072/f1-cards/patrick-robert-doyle-pm_CmPSl25U-unsplash_1_1.jpg',
    //   cite: 'Photo credit: https://unsplash.com/@teapowered?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText',
    // },
    // {
    //   src: 'https://res.cloudinary.com/chris-del/image/upload/v1651956072/f1-cards/gustavo-campos-B87zMorEZRo-unsplash_1_1.jpg',
    //   cite: 'Photo credit: https://unsplash.com/@gustavocpo?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText',
    // },
    // {
    //   src: 'https://res.cloudinary.com/chris-del/image/upload/v1651956071/f1-cards/abed-ismail-pBUMdQ3Q_C8-unsplash-min.jpg',
    //   cite: 'Photo credit: https://unsplash.com/@abedismail?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText',
    // },
    // {
    //   src: 'https://res.cloudinary.com/chris-del/image/upload/v1651980537/f1-cards/luis-jose-torrealba-E3PiwZJ8i1M-unsplash-min.jpg',
    //   cite: 'Photo credit: https://unsplash.com/@luisjoset?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText',
    // },
    // {
    //   src: 'https://res.cloudinary.com/chris-del/image/upload/v1651956071/f1-cards/glen-wheeler-gN3oQVVJDYo-unsplash-min.jpg',
    //   cite: 'Photo credit: https://unsplash.com/@glenwheeler?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText',
    // },
    // {
    //   src: 'https://res.cloudinary.com/chris-del/image/upload/v1651956071/f1-cards/tim-carey-QhK_agWFAsE-unsplash-min.jpg',
    //   cite: 'Photo credit: https://unsplash.com/@baudy?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText',
    // },
  },
}
