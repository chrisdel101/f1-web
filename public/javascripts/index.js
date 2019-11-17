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
    console.log("touch", is_touch_device())
    if (!is_touch_device()) {
      keyboardCardSelect(driverCardElem, e)
    } else if (is_touch_device()) {
      touchCardSelect(driverCardElem, e)
    } else {
      throw new TypeError("Browser type - touch or non-touch - not detected.")
    }
  })
})

const driverSubmitButton = document.querySelector("button.submit-all-drivers")
driverSubmitButton.addEventListener("click", async () => {
  try {
    const data = returnClickedCardsSlugs()
    return await postData("/drivers", data)
  } catch (e) {
    console.error("An error in submitting all drivers occured", e)
  }
})

async function postData(url, data) {
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "default", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json"
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrer: "no-referrer", // no-referrer, *client
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  })
  return await response.json() // parses JSON response into native JavaScript objects
}
function returnClickedCardsSlugs() {
  try {
    return driverObjs
      .filter(driver => driver.clicked)
      .map(driver => driver.name_slug)
  } catch (e) {
    console.error("An error occured while gathering all selected cards", e)
  }
}
// toggles current card on/off - touch only
function touchCardSelect(driverCardElem, e) {
  const nodeNameSlug = driverCardElem.parentNode.parentNode.dataset.slug
  const currentDriverObj = driverObjs.filter(driver => {
    if (driver.name_slug === nodeNameSlug) {
      return driver
    }
  })[0]
  // select current driver
  if (!currentDriverObj.clicked) {
    currentDriverObj.clicked = true
  } else {
    currentDriverObj.clicked = false
  }
  toggleClickedClass(currentDriverObj)
}

// toggles current card with shift bar action
function keyboardCardSelect(driverCardElem, e) {
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
}
function toggleClickedClass(driverObj) {
  // console.log(driverObj)
  if (driverObj.clicked) {
    console.log("toggle on", driverObj.name)
    // driverObj.clicked = true
    driverObj.originalElement.parentNode.classList.add("selected")
  } else {
    console.log("toggle off", driverObj.name)
    // driverObj.clicked = false
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
