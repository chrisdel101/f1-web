const driversController = require('../../controllers/drivers.controller')
const cache = require('../../cache')
const utils = require('../../utils')
const sinon = require('sinon')
const assert = require('assert')

describe('driversController', () => {
  describe.only('handleDriversCache()', () => {
    it.only('handleDriversCache gets data from API - not in cache ', function() {
      sinon.spy(utils, 'fetchData')
      const currentTimeStamp = new Date().getTime()
      return driversController
        .handleDriversCache(cache.testCache, currentTimeStamp)
        .then(res => {
          console.log('res', res)
          assert.notDeepEqual(res, cache.testCache.drivers)
          assert(utils.fetchData.calledOnce)
          utils.fetchData.restore()
        })
    })
    it('handleDriversCache gets data from API - fails timestamp', function() {
      // add fake driver key
      const oldTimeStamp = new Date('Nov 04 2019').getTime()
      cache.testCache = {
        drivers: {
          driverAction: '/driver',
          driversArr: [],
          formText: 'Choose a Driver',
          selectName: 'driver',
          timestamp: oldTimeStamp
        }
      }
      sinon.spy(utils, 'fetchData')
      return driversController
        .handleDriversCache(cache.testCache, 30)
        .then(res => {
          // console.log(res)
          assert.notDeepEqual(res, cache.testCache.drivers)
          assert(utils.fetchData.calledOnce)
          utils.fetchData.restore()
        })
    })
    it('handleDriversCache gets data from cache - passes timestamp', function() {
      // add fake driver key
      const oldTimeStamp = new Date().getTime()
      cache.testCache = {
        drivers: {
          driverAction: '/driver',
          formText: 'Choose a Driver',
          selectName: 'driver',
          driverEnums: [
            {
              name: 'Some Name',
              name_slug: 'some_name'
            }
          ],
          timestamp: oldTimeStamp
        }
      }
      sinon.spy(utils, 'fetchData')
      return driversController
        .handleDriversCache(cache.testCache, 30)
        .then(res => {
          console.log(res)
          console.log(cache)
          assert.deepEqual(res, cache.testCache.drivers)
          assert(utils.fetchData.notCalled)
          utils.fetchData.restore()
        })
    })
  })
})
