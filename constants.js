module.exports = {
  screenShotTypes: {
    DRIVERS: 'drivers',
    TEAMS: 'teams',
  },
  screenShotSizes: {
    FULL: 'full',
    MOBILE: 'mobile',
    MINI: 'mini',
  },
  // fit stats card - max-width 800
  cardSizes: {
    FULL: 'full', //full size of screen
    FIT: 'fit', //fit into viewport
    MINI: 'mini', // mini
  },
  // applies to stats card only - select is fixed 
  cardFormats: {
    WEB: 'web', // flex row
    MOBILE: 'mobile', // flex col
    MENU: 'menu', // pic + name only
  },
  cardLayouts: {
    STATS: 'stats', //card with stats
    SELECT: 'select', //card w/ img and name
  },
  cardTypes: {
    DRIVERS: 'drivers',
    TEAMS: 'teams',
    DRIVER: 'driver',
    TEAM: 'team',
  },
  pageTypes: {
    DRIVERS: 'drivers',
    TEAMS: 'teams',
    DRIVER: 'driver',
    TEAM: 'team',
  },
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
  carouselImages: [
    {
      smallSrc:
        'https://res.cloudinary.com/chris-del/image/upload/c_scale,h_400/v1652030788/f1-cards/originals/shawnanggg-rHx28bnBwjE-unsplash_2_1.jpg',
      medSrc:
        'https://res.cloudinary.com/chris-del/image/upload/c_scale,h_600/v1651977705/f1-cards/originals/shawnanggg-rHx28bnBwjE-unsplash_2_1.jpg',
      lgSrc:
        'https://res.cloudinary.com/chris-del/image/upload/v1652030788/f1-cards/originals/shawnanggg-rHx28bnBwjE-unsplash_2_1.jpg',
      cite: 'Photo credit: https://unsplash.com/@shawnanggg?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText',
    },
    {
      smallSrc:
        'https://res.cloudinary.com/chris-del/image/upload/c_scale,h_400/v1651980536/f1-cards/originals/hanson-lu-QV0AinhRU2c-unsplash_1_1.jpg',
      medSrc:
        'https://res.cloudinary.com/chris-del/image/upload/c_scale,h_600/v1651980536/f1-cards/originals/hanson-lu-QV0AinhRU2c-unsplash_1_1.jpg',
      lgSrc:
        'https://res.cloudinary.com/chris-del/image/upload/v1651980536/f1-cards/originals/hanson-lu-QV0AinhRU2c-unsplash_1_1.jpg',
      cite: 'Photo credit: https://unsplash.com/@hansonluu?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText',
    },
    {
      smallSrc:
        'https://res.cloudinary.com/chris-del/image/upload/c_scale,h_400/v1651983865/f1-cards/576/patrick-robert-doyle-pm_CmPSl25U-unsplash_1_1.jpg',
      medSrc:
        'https://res.cloudinary.com/chris-del/image/upload/c_scale,h_600/v1651956072/f1-cards/originals/patrick-robert-doyle-pm_CmPSl25U-unsplash_1_1.jpg',
      lgSrc:
        'https://res.cloudinary.com/chris-del/image/upload/v1651956072/f1-cards/originals/patrick-robert-doyle-pm_CmPSl25U-unsplash_1_1.jpg',
      cite: 'Photo credit: https://unsplash.com/@teapowered?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText',
    },
    {
      smallSrc:
        'https://res.cloudinary.com/chris-del/image/upload/c_scale,h_400/v1651983864/f1-cards/576/gustavo-campos-B87zMorEZRo-unsplash_1_1.jpg',
      medSrc:
        'https://res.cloudinary.com/chris-del/image/upload/c_scale,h_600/v1651956072/f1-cards/originals/gustavo-campos-B87zMorEZRo-unsplash_1_1.jpg',
      lgSrc:
        'https://res.cloudinary.com/chris-del/image/upload/v1651956072/f1-cards/originals/gustavo-campos-B87zMorEZRo-unsplash_1_1.jpg',
      cite: 'Photo credit: https://unsplash.com/@gustavocpo?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText',
    },
    {
      smallSrc:
        'https://res.cloudinary.com/chris-del/image/upload/c_scale,h_400/v1651983864/f1-cards/576/abed-ismail-pBUMdQ3Q_C8-unsplash-min.jpg',
      medSrc:
        'https://res.cloudinary.com/chris-del/image/upload/c_scale,h_600/v1651956071/f1-cards/originals/abed-ismail-pBUMdQ3Q_C8-unsplash-min.jpg',
      lgSrc:
        'https://res.cloudinary.com/chris-del/image/upload/v1651956071/f1-cards/originals/abed-ismail-pBUMdQ3Q_C8-unsplash-min.jpg',
      cite: 'Photo credit: https://unsplash.com/@abedismail?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText',
    },
    {
      smallSrc:
        'https://res.cloudinary.com/chris-del/image/upload/c_scale,h_400/v1651983864/f1-cards/576/luis-jose-torrealba-E3PiwZJ8i1M-unsplash-min.jpg',
      medSrc:
        'https://res.cloudinary.com/chris-del/image/upload/c_scale,h_600/v1651980537/f1-cards/originals/luis-jose-torrealba-E3PiwZJ8i1M-unsplash-min.jpg',
      lgSrc:
        'https://res.cloudinary.com/chris-del/image/upload/v1651980537/f1-cards/originals/luis-jose-torrealba-E3PiwZJ8i1M-unsplash-min.jpg',
      cite: 'Photo credit: https://unsplash.com/@luisjoset?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText',
    },
    {
      smallSrc:
        'https://res.cloudinary.com/chris-del/image/upload/c_scale,h_400/v1651983864/f1-cards/576/glen-wheeler-gN3oQVVJDYo-unsplash-min.jpg',
      medSrc:
        'https://res.cloudinary.com/chris-del/image/upload/c_scale,h_600/v1651956071/f1-cards/originals/glen-wheeler-gN3oQVVJDYo-unsplash-min.jpg',
      lgSrc:
        'https://res.cloudinary.com/chris-del/image/upload/v1651956071/f1-cards/originals/glen-wheeler-gN3oQVVJDYo-unsplash-min.jpg',
      cite: 'Photo credit: https://unsplash.com/@glenwheeler?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText',
    },
    {
      smallSrc:
        'https://res.cloudinary.com/chris-del/image/upload/c_scale,h_400/v1651983865/f1-cards/576/tim-carey-QhK_agWFAsE-unsplash-min.jpg',
      medSrc:
        'https://res.cloudinary.com/chris-del/image/upload/c_scale,h_600/v1651956071/f1-cards/originals/tim-carey-QhK_agWFAsE-unsplash-min.jpg',
      lgSrc:
        'https://res.cloudinary.com/chris-del/image/upload/v1651956071/f1-cards/originals/tim-carey-QhK_agWFAsE-unsplash-min.jpg',
      cite: 'Photo credit: https://unsplash.com/@baudy?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText',
    },
  ],
}
