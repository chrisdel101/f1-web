let driverCardsLinks = document.querySelectorAll(".driver-card.mini a")
driverCardsLinks = Array.from(driverCardsLinks)
// console.log("touch", is_touch_device())
// array of objs on the page currently selected
let driverObjs = []
let lastChecked
driverCardsLinks.forEach((driverCardElem, i) => {
  const driverObj = new createDriverObj(driverCardElem, i)
  driverObjs.push(driverObj)
  driverCardElem.addEventListener("click", function(e) {
    e.preventDefault()
    console.log("touch", is_touch_device())
    if (!is_touch_device()) {
      return returnClickedNon_touch(driverCardElem, e)
    } else if (is_touch_device()) {
      return retrunClickedTouch(driverCardElem, e)
    } else {
      throw new TypeError("Browser type - touch or non-touch - not detected.")
    }
  })
})
function retrunClickedTouch(driverCardElem, e) {
  const nodeNameSlug = driverCardElem.parentNode.parentNode.dataset.slug
  const currentDriverObj = driverObjs.filter(driver => {
    if (driver.name_slug === nodeNameSlug) {
      return driver
    }
  })[0]
  // select current driver
  currentDriverObj.clicked = true
  toggleClickedClass(currentDriverObj)
}
function returnClickedNon_touch(driverCardElem, e) {
  const nodeNameSlug = driverCardElem.parentNode.parentNode.dataset.slug
  const currentDriverObj = driverObjs.filter(driver => {
    if (driver.name_slug === nodeNameSlug) {
      return driver
    }
  })[0]
  // select current driver
  currentDriverObj.clicked = true
  toggleClickedClass(currentDriverObj)
  // un-click all previous
  if (!e.shiftKey) {
    // console.log("====two")
    // make current clicked true
    if (lastChecked) {
      // forward
      if (lastChecked.pageIndex < currentDriverObj.pageIndex) {
        // go from start all the way to the current - over all
        for (let i = 0; i < currentDriverObj.pageIndex; i++) {
          // console.log(i)
          driverObjs[i].clicked = false
          toggleClickedClass(driverObjs[i])
        }
        // backward
      } else if (lastChecked.pageIndex > currentDriverObj.pageIndex) {
        //  go from end all the way to the current - over all
        console.log(lastChecked.pageIndex)
        for (
          let i = driverObjs.length - 1;
          i > currentDriverObj.pageIndex;
          i--
        ) {
          // console.log("here", i)
          driverObjs[i].clicked = false
          toggleClickedClass(driverObjs[i])
        }
      }
    }
  }
  if (e.shiftKey) {
    // //   Going downwards
    // // if second pageindex is greater than last one
    if (currentDriverObj.pageIndex > lastChecked.pageIndex) {
      // console.log("one")
      // start at first index of obj array  - check all from start to current
      for (
        let i = lastChecked.pageIndex + 1;
        i <= currentDriverObj.pageIndex;
        i++
      ) {
        // console.log("current obj index", i)
        // fill in all boxes
        driverObjs[i].clicked = true
        toggleClickedClass(driverObjs[i])
      }
    } else if (lastChecked.pageIndex > currentDriverObj.pageIndex) {
      for (
        let i = lastChecked.pageIndex;
        i >= currentDriverObj.pageIndex;
        i--
      ) {
        // console.log("current obj index", i)
        // fill in all boxes
        driverObjs[i].clicked = true
        toggleClickedClass(driverObjs[i])
      }
    }
  }
  // assign current to last
  lastChecked = currentDriverObj
  console.log("last checked assigned", lastChecked)
  return driverObjs.filter(driver => driver.clicked)
}
function toggleClickedClass(driverObj) {
  // console.log(driverObj)
  if (driverObj.clicked) {
    console.log("toggle on", driverObj.name)
    driverObj.originalElement.parentNode.classList.add("selected")
  } else {
    console.log("toggle off", driverObj.name)
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
// https://stackoverflow.com/a/4819886/5972531
function is_touch_device() {
  var prefixes = " -webkit- -moz- -o- -ms- ".split(" ")
  var mq = function(query) {
    return window.matchMedia(query).matches
  }

  if (
    "ontouchstart" in window ||
    (window.DocumentTouch && document instanceof DocumentTouch)
  ) {
    return true
  }

  // include the 'heartz' as a way to have a non matching MQ to help terminate the join
  // https://git.io/vznFH
  var query = ["(", prefixes.join("touch-enabled),("), "heartz", ")"].join("")
  return mq(query)
}
