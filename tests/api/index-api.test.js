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
      const mockCtx = {
        path: `${urls.localCardsEndpoint}/api/mobile/driver/max-verstappen`,
        params: {
          team_slug: 'red_bull_racing',
          driver_slug: 'max-verstappen'
        }
      }
      const scope = nock(`${urls.localCardsEndpoint}`)
        .get('/driver/max-verstappen')
        .reply(200, {
          license: {
            key: 'mit',
            name: 'MIT License',
            spdx_id: 'MIT',
            url: 'https://api.github.com/licenses/mit',
            node_id: 'MDc6TGljZW5zZTEz'
          }
        })
      const res = api.takeCardScreenShot(mockCtx, 'driver')
      res.then(r => {
        console.log(scope.isDone())
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
