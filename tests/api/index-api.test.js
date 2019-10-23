const api = require('../../API/index')

describe('API tests', () => {
  it('sendImage takes mobile driver image', function() {
    const mockCtx = {
      path: 'https://f1-cards.herokuapp.com/api/mobile/driver/max-verstappen',
      params: {
        team_slug: 'red_bull_racing',
        driver_slug: 'max-verstappen'
      }
    }
    return api.sendImage(mockCtx, 'driver').then(res => {
      // console.log(res)
    })
  })
  it.only('sendImage takes mobile driver image', async function() {
    const mockCtx = {
      path: 'https://f1-cards.herokuapp.com/api/team/mercedes',
      params: {
        team_slug: 'mercedes',
        driver_slug: 'max-verstappen'
      }
    }
    return Promise.resolve(api.sendImage(mockCtx, 'team')).then(res => {
      console.log(res)
    })
  })
})
