const driverCards = document.querySelectorAll(".driver-card.mini a")
let driverObjs = []
let lastChecked
driverCards.forEach(driverCardElem => {
  driverCardElem.addEventListener("click", function(e) {
    e.preventDefault()
    const driverObj = new createDriverObj(e)
    driverObjs.push(driverObj)
    lastChecked = driverObjs[driverObjs.length - 1]
    // add class to parent li elem
    driverObj.element.parentNode.classList.add("selected")
    driverObj.clicked = true
    //   Going downwards
    // if second check is greater than first
    if (driverObjs[0] < lastChecked)
      if (e.shiftKey) {
        console.log("two")
        // start at first index of array of indexs - check from start to current
        for (let i = driverObjs[0]; i < lastChecked; i++) {
          // fill in all boxes
          console.log(driverObjs[i].element.classList.add)
          driverObjs[i].element.classList.add("selected")
        }
      }
    if (!e.shiftKey) {
      console.log("two")
      // add class to parent li elem
      driverObj.clicked = true
      toggleClickedClass(driverObj)
      console.log("lastChecked", lastChecked)
      // uncheck all up to but not current
      for (let i = 0; i < driverObjs.indexOf(lastChecked); i++) {
        driverObjs[i].clicked = false
        console.log(driverObjs[i])
        toggleClickedClass(driverObjs[i])
      }
      // move current to start of array
      driverObjs.splice(0, driverObjs.length - 1)
    }
    //   going upwards
    if (driverObjs[0] > lastChecked)
      if (e.shiftKey) {
        console.log("three")
        // start at first index of array of indexs
        // for (var i = lastChecked; i < driverObjs[0]; i++) {
        //   // fill in all boxes
        //   inputs[i].checked = true
        // }
      }
  })
})

// function checkAndShift(obj) {}
// function checkAndUnshift(obj) {
//   // console.log(e.shiftKey)
//   //   if (e.target.checked === false && e.shiftKey) {
//   //     return true
//   //   } else {
//   //     return false
//   //   }
// }
function sliceAndLastClicked(arr) {}
function toggleClickedClass(driverObj) {
  if (driverObj.clicked) {
    driverObj.element.parentNode.classList.add("selected")
  } else {
    driverObj.element.parentNode.classList.remove("selected")
  }
}
function createDriverObj(e) {
  this.name_slug = e.target.parentNode.parentNode.dataset.slug
  this.name = e.target.childNodes[0].childNodes[1].innerText
  this.shiftKey = e.shiftKey
  this.element = e.target
  this.clicked = false
}

// // get array of inputs
// var inputs = document.querySelectorAll("input")
// //  make nodelist and array
// inputs = Array.from(inputs)
// //  add listner to seach box
// inputs.forEach(input => {
//   input.addEventListener("click", e => {
//     var index = inputs.indexOf(e.target)
//     console.log(index)
//     checkedOrder.push(index)
//     lastChecked = checkedOrder[checkedOrder.length - 1]
//     // console.log(x)xx ;

//     // Going downwards
//     // if second check is greater than first
//     if (checkedOrder[0] < lastChecked)
//       if (checkAndShift(e) === true) {
//         console.log(index)
//         // start at first index of array of indexs
//         for (var i = checkedOrder[0]; i < lastChecked; i++) {
//           // fill in all boxes
//           inputs[i].checked = true
//         }
//       }
//     if (checkAndUnshift(e) === true) {
//       console.log(index)
//       for (var i = checkedOrder[0]; i < lastChecked; i++) {
//         inputs[i].checked = false
//       }
//     }
//     //   going upwards
//     if (checkedOrder[0] > lastChecked)
//       if (checkAndShift(e) === true) {
//         console.log(index)
//         // start at first index of array of indexs
//         for (var i = lastChecked; i < checkedOrder[0]; i++) {
//           // fill in all boxes
//           inputs[i].checked = true
//         }
//       }
//   })
// })
// // get e.childNodes[0].childNodes[0] innerHTML driver name
