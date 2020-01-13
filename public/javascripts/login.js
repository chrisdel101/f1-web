const form = document.querySelector('#login-form')
const fakeContext = {
  tid: '1234567891012131',
  thread_type: 'USER_TO_PAGE',
  psid: '1234567891012131',
  signed_request:
    '"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"',
  metadata: null
}
let context
function isDevelopment() {
  return new Promise((resolve, reject) => {
    const env = document.querySelectorAll('script[data-env]')[0].dataset.env
    console.log('env', env)
    if (env === 'development' || env === 'testing') {
      resolve(true)
    } else {
      reject(false)
    }
  })
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
window.extAsyncInit = async function() {
  console.log('load')
  if (!(await isDevelopment())) {
    console.log('not dev')
    // eslint-disable-next-line no-undef
    // get real contxt from FB
    getProdContext().then(res => {
      // set context to global scope
      context = res
      console.log('prod contex ready', context)
    })
  } else {
    // use fake context for dev
    context = fakeContext
  }
}
form.addEventListener('submit', e => {
  e.preventDefault()
  console.log(context)
})
