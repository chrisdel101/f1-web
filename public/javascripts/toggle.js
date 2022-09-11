document.addEventListener('DOMContentLoaded', () => {
  const toggleSwitch = document.querySelector('.switch')
  const { src } = toggleSwitch?.dataset
  const input = toggleSwitch.firstElementChild
  toggleSwitch.addEventListener('click', (e) => {
    e.preventDefault()
    // if checked, uncheck and send to mini
    if (input?.checked) {
      console.log(`${src}?size=mini`)
      window.location.replace(`${src}?size=mini`)
    } else {
    // else check
      console.log('bottom')
      window.location.replace(src)
    }
  })
})
