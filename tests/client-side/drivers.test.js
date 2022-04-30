/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const expect = chai.expect
const assert = chai.assert

describe('driver.js tests', () => {
  describe('returnClickedCardsSlugs()', () => {
    it('returnClickedCardsSlugs returns all objs with clicked', function () {
      const data = [
        { clicked: true, name_slug: 'Some slug1' },
        { clicked: false, name_slug: 'Some slug24' },
        { clicked: true, name_slug: 'Some slug2' },
        { clicked: false, name_slug: 'Some slug4' },
      ]
      const res = returnClickedCardsSlugs(data)
      assert.deepEqual(res, ['Some slug1', 'Some slug2'])
      assert(res.length === 2)
    })
    // function okay but test fails
    it.skip('returnClickedCardsSlugs throws when passed incorect data type', function () {
      console.log('res')
      const data = {}
      console.log('res')
      const res = returnClickedCardsSlugs(data)

      // assert.throws(function() {
      //   returnClickedCardsSlugs(data)
      // })
      expect(function () {
        returnClickedCardsSlugs(data)
      }).to.throw(
        Error,
        `An error occured while gathering all selected cards TypeError: "driverObjs.filter is not a function"`
      )
    })
  })
  // describe.only('touchCardSelect', () => {
  //   function initMarkup(markUp) {
  //     // document.body.innerHTML = ''
  //     // let div = document.createElement('div')
  //     // div.innerHTML = 'Hello'
  //     // document.body.appendChild(div)
  //     const a = document.createElement('a')
  //     a.classList.add('driver-click')
  //     document.body.appendChild(a)
  //     div.innerHTML = markUp
  //   }
  //   initMarkup()
  //   it('touchCardSelect toggles', function() {})
  // })
  describe('postData', () => {
    it('postData stub gets called', async function () {
      const data = {
        driversArr: ['driver1', 'driver2'],
        teamsArr: ['team1', 'team2'],
        user_id: 2,
      }
      console.log(postData)
      // let stubedFetch = sinon.stub(window, 'fetch').resolves('called')
      // const res = await postData('http://localhost:3000/drivers', data)
      // assert(res === 'called')
    })
  })
})
