const driverCards = document.querySelectorAll(".driver-card.mini a")
let checkedOrder = []
let lastChecked
driverCards.forEach(driverCard => {
  driverCard.addEventListener("click", function(e) {
    e.preventDefault()
    checkedOrder.push(new createDriverObj(e))
    lastChecked = checkedOrder[checkedOrder.length - 1]
    // console.log(checkedOrder)
    // console.log(lastChecked)
    //   Going downwards
    // if second check is greater than first
    console.log(e.shiftKey)
    if (checkedOrder[0] < lastChecked)
      if (e.shiftKey) {
        // start at first index of array of indexs - check from start to current
        // for (var i = checkedOrder[0]; i < lastChecked; i++) {
        //   // fill in all boxes
        //   driverCards[i].checked = true
        // }
      }
    if (!e.shiftKey) {
      console.log("two")
      // uncheck all up to but not current
      //   for (var i = checkedOrder[0]; i < lastChecked; i++) {
      //     inputs[i].checked = false
      //   }
    }
    //   going upwards
    if (checkedOrder[0] > lastChecked)
      if (e.shiftKey) {
        console.log("three")
        // start at first index of array of indexs
        // for (var i = lastChecked; i < checkedOrder[0]; i++) {
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
function createDriverObj(e) {
  this.name = e.target.childNodes[0].childNodes[1].innerText
  this.shiftKey = e.shiftKey
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
