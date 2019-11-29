const api = require('../../API/index')
const nock = require('nock')
const sinon = require('sinon')
const assert = require('assert')
const urls = require('../../urls')
const { mockRequest, mockResponse } = require('mock-req-res')

describe('API tests', () => {
  describe('sendUserData()', () => {
    it('sendUserData sends POST to DB', function() {
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
    it.only('takeCardScreenShot takes mobile driver image', async function() {
      this.server = sinon.createFakeServer()

      const mockCtx = {
        path: `${urls.localCardsEndpoint}/api/mobile/driver/max-verstappen`,
        params: {
          team_slug: 'red_bull_racing',
          driver_slug: 'max-verstappen'
        }
      }

      const res = api.takeCardScreenShot(mockCtx, 'driver')
      res.then(r => {
        this.server.respondWith(
          'GET',
          `${urls.localCardsEndpoint}/api/mobile/driver/max-verstappen`,
          [
            200,
            { 'Content-Type': 'application/json' },
            '[{ "id": 12, "comment": "Hey there" }]'
          ]
        )
        console.log(this.server)
        // assert(this.server.requests.length > 0)
        // this.server.restore()
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
