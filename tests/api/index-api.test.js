const api = require('../../API/index')
const nock = require('nock')

describe('API tests', () => {
  describe('sendUserDatatoDB()', () => {
    it('sendUserDatatoDB sends POST to DB', function() {
      const data = {
        driver_data: ['driver1', 'driver2'],
        team_data: ['team1', 'team2'],
        user_id: 2
      }
      return api.sendUserDatatoDB(data)
    })
  })
  describe('takeCardScreenShot()', () => {
    it.only('takeCardScreenShot takes mobile driver image', function() {
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
