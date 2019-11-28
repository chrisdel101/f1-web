const api = require('../../API/index')
const nock = require('nock')
const sinon = require('sinon')
const assert = require('assert')

describe('API tests', () => {
  describe('sendUserData()', () => {
    it.only('sendUserData sends POST to DB', function() {
      const data = {
        driver_data: ['driver1', 'driver2'],
        team_data: ['team1', 'team2'],
        user_id: 2
      }
      let stub = sinon.stub(api, 'sendUserData').returns('okay')
      api.sendUserData(data)
      assert(stub.calledOnce)
    })
  })
  describe('takeCardScreenShot()', () => {
    it('takeCardScreenShot takes mobile driver image', function() {
      const mockCtx = {
        path: 'https://f1-cards.herokuapp.com/api/mobile/driver/max-verstappen',
        params: {
          team_slug: 'red_bull_racing',
          driver_slug: 'max-verstappen'
        }
      }
      return api.takeCardScreenShot(mockCtx, 'driver').then(res => {
        console.log(res)
      })
    })
    it('takeCardScreenShot takes mobile driver image', async function() {
      const mockCtx = {
        path: 'https://f1-cards.herokuapp.com/api/team/mercedes',
        params: {
          team_slug: 'mercedes',
          driver_slug: 'max-verstappen'
        }
      }
      return Promise.resolve(api.takeCardScreenShot(mockCtx, 'team')).then(
        res => {
          console.log(res)
        }
      )
    })
  })
})
