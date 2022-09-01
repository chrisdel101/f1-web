let teamCardLinks = document.querySelectorAll('.team-card.mini a')
const fakeContext = {
  tid: '1234567891012131',
  thread_type: 'USER_TO_PAGE',
  psid: '1234567891012131',
  signed_request:
    '"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"',
  metadata: null,
}
teamCardLinks = Array.from(teamCardLinks)
// array of objs on the page currently selected
let teamObjs = []
let lastChecked
let context
teamCardLinks.forEach((teamCardElem, i) => {
  const teamObj = new createTeamObj(teamCardElem, i)
  teamObjs.push(teamObj)
  teamCardElem.addEventListener('click', function (e) {
    e.preventDefault()
    if (!is_touch_device()) {
      console.log('not touch', is_touch_device())
      keyboardCardSelect(teamCardElem, e)
    } else if (is_touch_device()) {
      console.log('touch', is_touch_device())
      touchCardSelect(teamCardElem, e)
    } else {
      throw new TypeError('Browser type - touch or non-touch - not detected.')
    }
  })
})

const teamSubmitButton = document.querySelector('button.submit-all-teams')
if (teamSubmitButton) {
  teamSubmitButton.addEventListener('click', async () => {
    try {
      const data = dataBundler(context, await returnClickedCardsSlugs(teamObjs))

      console.log(data)
      // send to back end
      return await postData('/teams', data)
    } catch (e) {
      console.error('An error in submitting all teams occured', e)
    }
  })
}
// makes data in an obj
function dataBundler(context, teams_arr) {
  return {
    user_id: context.psid,
    teams_arr,
  }
}

async function postData(url, data) {
  try {
    if (!data.teams_arr.length || !data.teams_arr) return 'No data'
    console.log('click submit')
    let mode
    if (!isDevelopment()) {
      mode = 'cors'
    } else {
      mode = 'no-cors'
    }
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: mode,
      cache: 'default', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    return await response // parses JSON response into native JavaScript objects
  } catch (e) {
    console.error('An error in team postData', e)
  }
}
// return arr of team slugs
async function returnClickedCardsSlugs(teamObjs) {
  try {
    return teamObjs.filter((team) => team.clicked).map((team) => team.name_slug)
  } catch (e) {
    console.error('An error occured while gathering all selected cards', e)
  }
}
// toggles current card on/off - touch only
function touchCardSelect(teamCardElem) {
  const nodeNameSlug = teamCardElem.parentNode.parentNode.dataset.slug
  const currentTeamObj = teamObjs.filter((team) => {
    if (team.name_slug === nodeNameSlug) {
      return team
    }
  })[0]
  // select current driver
  if (!currentTeamObj.clicked) {
    currentTeamObj.clicked = true
  } else {
    currentTeamObj.clicked = false
  }
  toggleClickedClass(currentTeamObj)
}

// toggles current card with shift bar action
function keyboardCardSelect(teamCardElem, e) {
  const nodeNameSlug = teamCardElem.parentNode.parentNode.dataset.slug
  // console.log(nodeNameSlug)
  const currentTeamObj = teamObjs.filter((team) => {
    if (team.name_slug === nodeNameSlug) {
      return team
    }
  })[0]
  // select current team
  currentTeamObj.clicked = true
  toggleClickedClass(currentTeamObj)
  // un-click all previous
  if (!e.shiftKey) {
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
        // console.log(lastChecked.pageIndex)
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
          // fill in all boxes
          teamObjs[i].clicked = true
          toggleClickedClass(teamObjs[i])
        }
      }
    }
  }
  // assign current to last
  lastChecked = currentTeamObj
  // console.log("last checked assigned", lastChecked)
}
function toggleClickedClass(teamObj) {
  // console.log(teamObj)
  if (teamObj.clicked) {
    console.log('toggle on', teamObj.name)
    // teamObj.clicked = true
    teamObj.originalElement.parentNode.classList.add('selected')
  } else {
    console.log('toggle off', teamObj.name)
    // teamObj.clicked = false
    teamObj.originalElement.parentNode.classList.remove('selected')
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
  var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ')
  var mq = function (query) {
    return window.matchMedia(query).matches
  }

  if (
    'ontouchstart' in window ||
    // eslint-disable-next-line no-undef
    (window.DocumentTouch && document instanceof DocumentTouch)
  ) {
    return true
  }

  // include the 'heartz' as a way to have a non matching MQ to help terminate the join
  // https://git.io/vznFH
  var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('')
  return mq(query)
}
async function getProdContext() {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-undef
    MessengerExtensions.getContext(
      '428256864460216',
      function success(thread_context) {
        resolve(thread_context)
      },
      function error(err) {
        if (err) {
          console.error('An error occured in the getContext()', err)
          reject(err)
        }
      }
    )
  })
}
// get script from page
function isDevelopment() {
  return new Promise((resolve, reject) => {
    const env = document.querySelectorAll('script[data-env]')[0].dataset.env
    if (env === 'development' || env === 'testing') {
      console.log('env', env)
      resolve(true)
    } else {
      reject(false)
    }
  })
}
window.extAsyncInit = async function () {
  if (!(await isDevelopment())) {
    // eslint-disable-next-line no-undef
    // get real contxt from FB
    getProdContext().then((res) => {
      // set context to global scope
      context = res
      console.log('contex ready', context)
    })
  } else {
    // use fake context for dev
    context = fakeContext
  }
}
