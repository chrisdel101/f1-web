// https://www.w3schools.com/howto/howto_js_media_queries.asp
let hasMobileTag = false
let hasWebTag = false
var breakPoint = window.matchMedia('(min-width: 768px)')
toggleClass(breakPoint) // Call listener function at run time
breakPoint.addListener(toggleClass) // Attach listener function

function toggleClass(breakPoint) {
  // If media query matches
  let currentCard =
    document.querySelector('.driver-card') ||
    document.querySelector('.team-card')
  if (!currentCard) return
  // on load check of query params in window href
  checkForQueryParams(currentCard)
  console.log(hasMobileTag)
  if(hasMobileTag || hasWebTag) return 
  console.log(hasMobileTag)
  if (breakPoint.matches) {
    console.log('Remove mobile')
    currentCard.classList.remove('mobile')
    currentCard.classList.add('web')
  } else {
    currentCard.classList.remove('web')
    currentCard.classList.add('mobile')
  }
}
// check if tag in URL
function checkForQueryParams(){
 let currentURL = window.location.href
//  console.log('XX',currentURL)
  if(currentURL.includes('mobile')){
    console.log('HAS mobile')
    hasMobileTag = true
    console.log('HAS mobile', hasMobileTag)
  } else if(hasMobileTag){
    console.log('reset mobile')

    hasMobileTag = false
  }
  if(currentURL.includes('web')){
    console.log('HAS web')
    hasMobileTag = true
  } else if(hasWebTag){
    console.log('reset web')
    hasMobileTag = false
  }
}