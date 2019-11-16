let driverCardsLinks = document.querySelectorAll(".driver-card.mini a")
driverCardsLinks = Array.from(driverCardsLinks)
// array of objs on the page currently selected
let driverObjs = []
let lastChecked
driverCardsLinks.forEach(driverCardElem => {
  driverCardElem.addEventListener("click", function(e) {
    e.preventDefault()
    // index of current within the html nodelist on physical page
    const pageIndex = driverCardsLinks.indexOf(driverCardElem)
    const driverObj = new createDriverObj(e, pageIndex)
    // check if current obj is already in objs array
    const exists = driverObjs.some(obj => obj.name_slug === driverObj.name_slug)
    // check new obj, to avoid doubles
    if (!exists) {
      console.log("does not exists: push if false:", exists)
      driverObjs.push(driverObj)
    }
    // index of current within the elements selected
    const arrIndex = driverObjs.indexOf(driverObj)
    console.log("arrIndex", arrIndex)

    // add class to parent li elem
    driverObj.clicked = true
    // add class to current
    toggleClickedClass(driverObj)
    // note last checked
    // lastChecked = driverObjs[driverObjs.length - 1]
    // console.log("current Arr", driverObjs)
    // console.log("last checked top", lastChecked)

    if (!e.shiftKey) {
      console.log("====two", driverObjs.indexOf(lastChecked))
      // uncheck all objs in array up to not including current
      for (let i = 0; i < arrIndex; i++) {
        console.log(i)
        driverObjs[i].clicked = false
        toggleClickedClass(driverObjs[i])
      }
      // // slice off all arr - move current obj to start
      driverObjs.splice(0, driverObjs.length - 1)
      // console.log("arr", driverObjs)
    }

    // // console.log("lastChecked", lastChecked)
    // // add class to parent li elem
    // // driverObj.element.parentNode.classList.add("selected")
    // // driverObj.clicked = true
    // /
    if (e.shiftKey) {
      // //   Going downwards
      // // if second pageindex is greater than last one
      if (driverObj.pageIndex > lastChecked.pageIndex) {
        console.log("one")
        // start at first index of obj array  - check all from start to current
        console.log("current obj index", arrIndex)
        for (let i = driverObjs[0]; i < arrIndex; i++) {
          // fill in all boxes
          driverObjs[i].clicked = true
          toggleClickedClass(driverObjs[i])
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
    lastChecked = driverObjs[driverObjs.length - 1]
    console.log("last check bottom", lastChecked)
    console.log("last index", driverObjs.indexOf(lastChecked))
  })
})
function toggleClickedClass(driverObj) {
  if (driverObj.clicked) {
    console.log("toggle on", driverObj)
    driverObj.element.parentNode.classList.add("selected")
  } else {
    console.log("toggle off", driverObj)
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
