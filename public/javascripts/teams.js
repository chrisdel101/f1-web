let teamCardLinks = document.querySelectorAll(".team-card.mini a")

teamCardLinks = Array.from(teamCardLinks)
// array of objs on the page currently selected
let teamObjs = []
let lastChecked
teamCardLinks.forEach((teamCardElem, i) => {
  const teamObj = new createTeamObj(teamCardElem, i)
  teamObjs.push(teamObj)
  teamCardElem.addEventListener("click", function(e) {
    e.preventDefault()
    if (!is_touch_device()) {
      console.log("not touch", is_touch_device())
      keyboardCardSelect(teamCardElem, e)
    } else if (is_touch_device()) {
      console.log("touch", is_touch_device())
      // touchCardSelect(teamCardElem, e)
    } else {
      throw new TypeError("Browser type - touch or non-touch - not detected.")
    }
  })
})

const teamSubmitButton = document.querySelector("button.submit-all-teams")
teamSubmitButton.addEventListener("click", async () => {
  try {
    const data = await returnClickedCardsSlugs()
    return await postData("/teams", data)
  } catch (e) {
    console.error("An error in submitting all drivers occured", e)
  }
})

async function postData(url, data) {
  if (!data.length || !data) return
  console.log("click submit")
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
async function returnClickedCardsSlugs() {
  try {
    return teamObjs.filter(team => team.clicked).map(team => team.name_slug)
  } catch (e) {
    console.error("An error occured while gathering all selected cards", e)
  }
}
// toggles current card on/off - touch only
function touchCardSelect(teamCardElem, e) {
  const nodeNameSlug = teamCardElem.parentNode.parentNode.dataset.slug
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
function keyboardCardSelect(teamCardElem, e) {
  const nodeNameSlug = teamCardElem.parentNode.parentNode.dataset.slug
  // console.log(nodeNameSlug)
  const currentTeamObj = teamObjs.filter(team => {
    if (team.name_slug === nodeNameSlug) {
      return team
    }
  })[0]
  // select current driver
  currentTeamObj.clicked = true
  toggleClickedClass(currentTeamObj)
  // un-click all previous
  if (!e.shiftKey) {
    // console.log("====two")
    // make current clicked true
    if (lastChecked) {
      // forward
      if (lastChecked.pageIndex < currentTeamObj.pageIndex) {
        // go from start all the way to the current - over all
        for (let i = 0; i < currentTeamObj.pageIndex; i++) {
          // console.log(i)
          teamObjs[i].clicked = false
          toggleClickedClass(teamObjs[i])
        }
        // backward
      } else if (lastChecked.pageIndex > currentTeamObj.pageIndex) {
        //  go from end all the way to the current - over all
        console.log(lastChecked.pageIndex)
        for (let i = teamObjs.length - 1; i > currentTeamObj.pageIndex; i--) {
          // console.log("here", i)
          teamObjs[i].clicked = false
          toggleClickedClass(teamObjs[i])
        }
      }
    }
  }
  // //   Going downwards
  if (e.shiftKey) {
    // make sure lastChecked
    if (lastChecked) {
      // // if second pageindex is greater than last one
      if (currentTeamObj.pageIndex > lastChecked.pageIndex) {
        // console.log("one")
        // start at first index of obj array  - check all from start to current
        for (
          let i = lastChecked.pageIndex + 1;
          i <= currentTeamObj.pageIndex;
          i++
        ) {
          // console.log("current obj index", i)
          // fill in all boxes
          teamObjs[i].clicked = true
          toggleClickedClass(teamObjs[i])
        }
      } else if (lastChecked.pageIndex > currentTeamObj.pageIndex) {
        for (
          let i = lastChecked.pageIndex;
          i >= currentTeamObj.pageIndex;
          i--
        ) {
          // console.log("current obj index", i)
          // fill in all boxes
          teamObjs[i].clicked = true
          toggleClickedClass(teamObjs[i])
        }
      }
    }
  }
  // assign current to last
  lastChecked = currentTeamObj
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
function createTeamObj(elem, pageIndex) {
  this.pageIndex = pageIndex
  this.name_slug = elem.parentNode.parentNode.dataset.slug
  this.name = elem.childNodes[0].innerText
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
