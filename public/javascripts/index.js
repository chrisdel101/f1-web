let driverCardsLinks = document.querySelectorAll(".driver-card.mini a")
driverCardsLinks = Array.from(driverCardsLinks)
// array of objs on the page currently selected
let driverObjs = []
let lastChecked
driverCardsLinks.forEach((driverCardElem, i) => {
  const driverObj = new createDriverObj(driverCardElem, i)
  driverObjs.push(driverObj)
  driverCardElem.addEventListener("click", function(e) {
    e.preventDefault()
    const nodeNameSlug = driverCardElem.parentNode.parentNode.dataset.slug
    const currentDriverObj = driverObjs.filter(driver => {
      if (driver.name_slug === nodeNameSlug) {
        return driver
      }
    })[0]
    // un-click all previous
    if (!e.shiftKey) {
      console.log("====two")
      // make current clicked true
      driverObj.clicked = true
      toggleClickedClass(currentDriverObj)
      if (lastChecked) {
        // forward
        if (lastChecked.pageIndex < currentDriverObj.pageIndex) {
          // uncheck all objs in array up to not including current
          for (
            let i = lastChecked.pageIndex;
            i < currentDriverObj.pageIndex;
            i++
          ) {
            console.log(i)
            driverObjs[i].clicked = false
            toggleClickedClass(driverObjs[i])
          }
          // backward
        } else if (lastChecked.pageIndex > currentDriverObj.pageIndex) {
          // uncheck all objs in array down to but not including current
          for (
            let i = lastChecked.pageIndex;
            i > currentDriverObj.pageIndex;
            i--
          ) {
            console.log(i)
            driverObjs[i].clicked = false
            toggleClickedClass(driverObjs[i])
          }
        }
      }
    }
    //   // // console.log("lastChecked", lastChecked)
    //   // // add class to parent li elem
    //   // // driverObj.element.parentNode.classList.add("selected")
    //   // // driverObj.clicked = true
    //   // /
    //   if (e.shiftKey) {
    //     // //   Going downwards
    //     // // if second pageindex is greater than last one
    //     if (driverObj.pageIndex > lastChecked.pageIndex) {
    //       console.log("one")
    //       // start at first index of obj array  - check all from start to current
    //       console.log("current obj index", arrIndex)
    //       for (let i = driverObjs[0]; i < arrIndex; i++) {
    //         // fill in all boxes
    //         driverObjs[i].clicked = true
    //         toggleClickedClass(driverObjs[i])
    //       }
    //     }
    //   }
    //   // going upwards
    //   // if (driverObjs[0] > lastChecked) {
    //   //   if (e.shiftKey) {
    //   //     console.log("three")
    //   //     // start at first index of array of indexs
    //   //     // for (var i = lastChecked; i < driverObjs[0]; i++) {
    //   //     //   // fill in all boxes
    //   //     //   inputs[i].checked = true
    //   //     // }
    //   //   }
    //   // }
    lastChecked = currentDriverObj
    //   console.log("last check bottom", lastChecked)
    //   console.log("last index", driverObjs.indexOf(lastChecked))
  })
})
function toggleClickedClass(driverObj) {
  console.log(driverObj)
  if (driverObj.clicked) {
    console.log("toggle on", driverObj)
    driverObj.originalElement.parentNode.classList.add("selected")
  } else {
    console.log("toggle off", driverObj)
    driverObj.originalElement.parentNode.classList.remove("selected")
  }
}
function createDriverObj(elem, pageIndex) {
  this.pageIndex = pageIndex
  this.name_slug = elem.parentNode.parentNode.dataset.slug
  this.name = elem.childNodes[0].childNodes[1].innerText
  this.parent = elem.parentNode.parentNode
  this.originalElement = elem
  this.clicked = false
}
