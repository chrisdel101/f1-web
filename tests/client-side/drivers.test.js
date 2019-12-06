/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const expect = chai.expect
const assert = chai.assert
describe('driver.js tests', () => {
  describe('returnClickedCardsSlugs()', () => {
    it('returnClickedCardsSlugs returns an arr', function() {
      const data = [
        { clicked: true, name_slug: 'Some slug1' },
        { clicked: true, name_slug: 'Some slug2' },
        { clicked: false, name_slug: 'Some slug2' }
      ]
      const res = returnClickedCardsSlugs(data)
      chai.assert.deepEqual(res, ['Some slug1', 'Some slug2'])
    })
  })
  describe('postData', () => {
    it('postData works', async function() {
      const data = {
        driversArr: ['driver1', 'driver2'],
        teamsArr: ['team1', 'team2'],
        user_id: 2
      }
      const res = await postData('http://localhost:3000/drivers', data)
      console.log('res', res)
      setTimeout(() => {
        console.log('res', res)
      }, 1000)
    })
  })
})
