document.addEventListener('DOMContentLoaded', () => {
  const toggleSwitch = document.querySelector('.switch')
  const { src } = toggleSwitch?.dataset
  console.log('DD', src)
  const input = toggleSwitch.firstElementChild
  toggleSwitch.addEventListener('click', (e) => {
    e.preventDefault()
    if (input?.checked) {
      console.log(`${src}?size=mini`)
      window.location.replace(`${src}?size=mini`)
    } else {
      console.log('bottom')
      window.location.replace(src)
    }
  })
})

// function redirect(url) {
//   window.location.replace(url)
// }
