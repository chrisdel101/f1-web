const assert = require('assert')
const utils = require('../utils')
const urls = require('../envUrls')
const api = require('../API/index')

require('dotenv').config(
  '/Users/chrisdielschnieder/desktop/code_work/formula1/f1Web/.env'
)
// LIVE TESTS
describe('live tests', () => {
  describe('httpCall()', () => {
    it('httpCall calls localAPI', async function () {
      console.log(urls.localF1('test'))
      let res = await utils.httpCall(urls.localF1('test'))
      console.log(res)
      assert(res === 'access okay')
    })
  })
  describe('sendUserData', () => {
    it('sendUserData sends POST to DB success', function () {
      let data = {
        driver_data: ['driver1', 'driver2'],
        team_data: ['team1', 'team2'],
        user_id: 2,
      }
      data = JSON.stringify(data)
      api.sendUserData(data, urls.localF1('user'))
    })
  })
})
