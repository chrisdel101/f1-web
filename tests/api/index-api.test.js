const api = require('../../API/index')
const sinon = require('sinon')
const assert = require('assert')
const urls = require('../../envUrls')
const puppeteer = require('puppeteer')

describe('API tests', () => {
  describe('sendUserData()', () => {
    it('sendUserData sends POST to DB success', function () {
      const data = {
        driver_data: ['driver1', 'driver2'],
        team_data: ['team1', 'team2'],
        user_id: 2,
      }
      let stub = sinon.stub(api, 'sendUserData').returns('okay')
      api.sendUserData(data, `${urls.localCardsEndpoint}/test`)
      assert(stub.calledOnce)
      api.sendUserData.restore()
    })
    it('sendUserData sends POST to DB', function () {
      const data = {
        driver_data: ['driver1', 'driver2'],
        team_data: ['team1', 'team2'],
        user_id: 2,
      }
      let stub = sinon.stub(api, 'sendUserData').returns('okay')
      api.sendUserData(data)
      assert(stub.calledOnce)
    })
    it('sendUserData sends POST to DB', function () {
      const data = {
        driver_data: ['driver1', 'driver2'],
        team_data: ['team1', 'team2'],
        user_id: 2,
      }
      // let stub = sinon.stub(api, 'sendUserData').returns('okay')
      api.sendUserData(data, urls.localF1('user'))
      // assert(stub.calledOnce)
    })
  })
  describe.skip('takeCardScreenShot()', () => {
    it('takeCardScreenShot takes mobile driver image', async function () {
      const mockCtx = {
        path: `${urls.localCardsEndpoint}/api/mobile/driver/max-verstappen`,
        params: {
          team_slug: 'red_bull_racing',
          driver_slug: 'max-verstappen',
        },
      }
      const stub = sinon.stub(puppeteer, 'page')
      console.log(stub)
      const res = api.takeCardScreenShot(mockCtx, 'driver')
      res.then((r) => {})
    })
    it('takeCardScreenShot takes mobile driver image', async function () {
      const mockCtx = {
        path: 'https://f1-cards.herokuapp.com/api/team/mercedes',
        params: {
          team_slug: 'mercedes',
          driver_slug: 'max-verstappen',
        },
      }
      return Promise.resolve(api.takeCardScreenShot(mockCtx, 'team')).then(
        (res) => {
          console.log(res)
        }
      )
    })
  })
})
