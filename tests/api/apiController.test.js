const api = require('../../API/api.controller')
const sinon = require('sinon')
const assert = require('assert')
const { urls } = require('../../constants')
const puppeteer = require('puppeteer')

describe('API Controller Tests', () => {
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
  describe('Build screen shot objs', () => {
    describe('buildDriverScreenShotData', () => {
      it('builds driver screen shot data object', async function () {
        return await api.buildDriverScreenShotData()
      })
    })
    describe('buildTeamScreenShotData', () => {
      it('builds team screen shot data object', async function () {
        return await api.buildTeamScreenShotData()
      })
    })
  })
  describe.only('Take all screen shots pre-load', () => {
    describe('takeCardScreenShots', () => {
      it('takes all screenshots of urls obj', async function () {
        const { teamFullImgs, teamMobileImgs, teamMiniImgs } =
          await api.buildTeamScreenShotData()
        return await api.takeCardScreenShots(teamMiniImgs)
      })
    })
  })
})
