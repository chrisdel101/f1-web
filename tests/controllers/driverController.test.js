const driverController = require('../../controllers/drivers.controller')
const cache = require('../../cache')

describe.only('driverController', () => {
  describe('handleDriversCache()', () => {
    it('handleDriversCache gets data from cache - not in cache ', function() {
      const currentTimeStamp = new Date().getTime()
      const res = driverController.handleDriversCache(
        cache.testCache,
        currentTimeStamp
      )
      console.log(res)
    })
  })
})
