let driverCardsLinks = document.querySelectorAll('.driver-card.mini a')
// use this fake data in dev
const fakeContext = {
  tid: '1234567891012131',
  thread_type: 'USER_TO_PAGE',
  psid: '1234567891012131',
  signed_request:
    '"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"',
  metadata: null
}
// convert to array
driverCardsLinks = Array.from(driverCardsLinks)
// array of objs on the page currently selected
let driverObjs = []
let lastChecked
let context
driverCardsLinks.forEach((driverCardLinkElem, i) => {
  const driverObj = new createDriverObj(driverCardLinkElem, i)
  driverObjs.push(driverObj)
  driverCardLinkElem.addEventListener('click', function(e) {
    e.preventDefault()
    if (!is_touch_device()) {
      console.log('not touch', is_touch_device())
      keyboardCardSelect(driverCardLinkElem, e)
      console.log('driverCardEl', driverCardLinkElem)
    } else if (is_touch_device()) {
      console.log('touch', is_touch_device())
      touchCardSelect(driverCardLinkElem, e)
    } else {
      throw new TypeError('Browser type - touch or non-touch - not detected.')
    }
  })
})
const driverSubmitButton = document.querySelector('button.submit-all-drivers')
if (driverSubmitButton) {
  driverSubmitButton.addEventListener('click', async () => {
    try {
      // construct obj to send to backend
      const data = dataBundler(
        context,
        await returnClickedCardsSlugs(driverObjs)
      )
      console.log(data)
      return await postData('/drivers', data)
    } catch (e) {
      console.error('An error in submitting all drivers occured', e)
    }
  })
}
// makes data in an obj
function dataBundler(context, drivers_arr) {
  return {
    user_id: context.psid,
    drivers_arr
  }
}
// takes an obj with driversArr prop - calls backend
async function postData(url, data) {
  try {
    if (!data.drivers_arr.length || !data.drivers_arr)
      return 'No data supplied to fetch'
    console.log('click submit')
    let mode
    if (!isDevelopment()) {
      mode = 'cors'
    } else {
      mode = 'no-cors'
    }
    const response = await fetch(url, {
      method: 'POST',
      mode: mode,
      cache: 'default', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    })
    return await response // parses JSON response into native JavaScript objects
  } catch (e) {
    console.error('An error in driver postData', e)
  }
}
// returns array of driver slugs with clicked attr
function returnClickedCardsSlugs(driverObjs) {
  try {
    return driverObjs
      .filter(driver => driver.clicked)
      .map(driver => driver.name_slug)
  } catch (e) {
    console.error('An error occured while gathering all selected cards', e)
  }
}
// toggles current card on/off - touch only
// takes a tag of driver card
function touchCardSelect(driverCardLinkElem) {
  // target name inside container from a tag
  const nodeNameSlug = driverCardLinkElem.parentNode.parentNode.dataset.slug
  // match name to proper driver obj
  const currentDriverObj = driverObjs.filter(driver => {
    if (driver.name_slug === nodeNameSlug) {
      return driver
    }
  })[0]
  // toggle clicked on matched driver obj
  if (!currentDriverObj.clicked) {
    currentDriverObj.clicked = true
  } else {
    currentDriverObj.clicked = false
  }
  toggleClickedClass(currentDriverObj)
}

// toggles current card with shift bar action
function keyboardCardSelect(driverCardLinkElem, e) {
  const nodeNameSlug = driverCardLinkElem.parentNode.parentNode.dataset.slug
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
  // //   Going downwards
  if (e.shiftKey) {
    if (lastChecked) {
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
  }
  // assign current to last
  lastChecked = currentDriverObj
  // console.log("last checked assigned", lastChecked)
}
function toggleClickedClass(driverObj) {
  // console.log(driverObj)
  if (driverObj.clicked) {
    console.log('toggle on', driverObj.name)
    // driverObj.clicked = true
    driverObj.originalElement.parentNode.classList.add('selected')
  } else {
    console.log('toggle off', driverObj.name)
    // driverObj.clicked = false
    driverObj.originalElement.parentNode.classList.remove('selected')
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
  var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ')
  var mq = function(query) {
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
window.extAsyncInit = async function() {
  if (!(await isDevelopment())) {
    // eslint-disable-next-line no-undef
    // get real contxt from FB
    getProdContext().then(res => {
      // set context to global scope
      context = res
      console.log('contex ready', context)
    })
  } else {
    // use fake context for dev
    context = fakeContext
  }
}
