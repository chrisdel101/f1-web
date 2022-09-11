// https://www.w3schools.com/howto/howto_js_media_queries.asp
var breakPoint = window.matchMedia('(min-width: 768px)')
toggleClass(breakPoint) // Call listener function at run time
breakPoint.addListener(toggleClass) // Attach listener function

function toggleClass(breakPoint) {
  // If media query matches
  let currentCard =
    document.querySelector('.driver-card') ||
    document.querySelector('.team-card')
  if (!currentCard) return
  if (breakPoint.matches) {
    //    check for driver or team
    currentCard.classList.remove('mobile')
    currentCard.classList.add('web')
  } else {
    currentCard.classList.remove('web')
    currentCard.classList.add('mobile')
  }
}
