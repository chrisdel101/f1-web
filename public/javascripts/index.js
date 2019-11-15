let driverCardsLinks = document.querySelectorAll(".driver-card.mini a")
driverCardsLinks = Array.from(driverCardsLinks)
// let driverCards = document.querySelectorAll(".driver-card.mini")
let driverObjs = []
let lastChecked
driverCardsLinks.forEach(driverCardElem => {
  driverCardElem.addEventListener("click", function(e) {
    e.preventDefault()
    const pageIndex = driverCardsLinks.indexOf(driverCardElem)
    const driverObj = new createDriverObj(e, pageIndex)
    const exists = driverObjs.some(obj => obj.name_slug === driverObj.name_slug)
    // check new obj, to avoid doubles
    if (!exists) {
      console.log("does not exists: push", exists)
      driverObjs.push(driverObj)
    }
    // add class to parent li elem
    driverObj.clicked = true
    // add class to current
    toggleClickedClass(driverObj)
    // note last checked
    lastChecked = driverObjs[driverObjs.length - 1]
    console.log("last", lastChecked)
    console.log("last index", driverObjs.indexOf(lastChecked))

    if (!e.shiftKey) {
      console.log("two", driverObjs.indexOf(lastChecked))
      for (let i = 0; i < driverObjs.indexOf(lastChecked); i++) {
        driverObjs[i].clicked = false
        toggleClickedClass(driverObjs[i])
        // console.log("all up to", driverObjs[i])
        // toggleClickedClass(driverObjs[i])
      }
      // // slice off all arr - move current to start
      driverObjs.splice(0, driverObjs.length - 1)
      console.log("arr", driverObjs)
    }

    // // console.log("lastChecked", lastChecked)
    // // add class to parent li elem
    // // driverObj.element.parentNode.classList.add("selected")
    // // driverObj.clicked = true
    // //   Going downwards
    // // if second check is greater than first
    // /
    if (e.shiftKey) {
      if (driversObj < driverlastChecked) {
        console.log("one")
        // start at first index of array of indexs - check from start to current
        for (let i = driverObjs[0]; i < lastChecked; i++) {
          // fill in all boxes
          console.log(driverObjs[i].element.classList.add)
          driverObjs[i].element.classList.add("selected")
        }
      }
    }
    // going upwards
    // if (driverObjs[0] > lastChecked) {
    //   if (e.shiftKey) {
    //     console.log("three")
    //     // start at first index of array of indexs
    //     // for (var i = lastChecked; i < driverObjs[0]; i++) {
    //     //   // fill in all boxes
    //     //   inputs[i].checked = true
    //     // }
    //   }
    // }
  })
})
function toggleClickedClass(driverObj) {
  if (driverObj.clicked) {
    driverObj.element.parentNode.classList.add("selected")
  } else {
    driverObj.element.parentNode.classList.remove("selected")
  }
}
function createDriverObj(e, pageIndex) {
  this.pageIndex = pageIndex
  this.name_slug = e.target.parentNode.parentNode.dataset.slug
  this.name = e.target.childNodes[0].childNodes[1].innerText
  this.shiftKey = e.shiftKey
  this.element = e.target
  this.clicked = false
}
