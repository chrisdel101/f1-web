const {
  handleDriversCache,
  handleDriverCache,
  handleTeamsCache
} = require('../../controllers/cache.controller')
var assert = require('assert')
const cache = require('../../cache')
const utils = require('../../utils')
const sinon = require('sinon')

describe('cacheController()', () => {
  describe('handleTeamsCache()', () => {
    it('handleTeamsCache gets data from API - not in cache ', function() {
      sinon.spy(utils, 'fetchData')
      const currentTimeStamp = new Date().getTime()
      return handleTeamsCache(cache.testCache, currentTimeStamp).then(res => {
        console.log('res', res)
        assert(utils.fetchData.calledOnce)
        // reassign empty cache value
        cache.testCache = utils.resetCache(null, cache.testCache)
        utils.fetchData.restore()
      })
    })
    it('handleTeamsCache is empty and adds to cache', function() {
      const currentTimeStamp = new Date().getTime()
      // no drivers key in cache
      assert(!cache.testCache.hasOwnProperty('teams'))
      return handleTeamsCache(cache.testCache, currentTimeStamp).then(res => {
        // key added to cache
        assert(cache.testCache.hasOwnProperty('teams'))
        cache.testCache = utils.resetCache(null, cache.testCache)
      })
    })
    it('handleTeamsCache gets data from API - fails timestamp', function() {
      // add fake driver key
      const oldTimeStamp = new Date('Nov 04 2019').getTime()
      cache.testCache = {
        teams: {
          teamAction: '/team',
          teamsArr: [],
          formText: 'Choose a Team',
          selectName: 'team',
          timestamp: oldTimeStamp
        }
      }
      sinon.spy(utils, 'fetchData')
      return handleTeamsCache(cache.testCache, 30).then(res => {
        assert(utils.fetchData.calledOnce)
        utils.fetchData.restore()
        cache.testCache = utils.resetCache(null, cache.testCache)
      })
    })
    it('handleTeamsCache gets data from cache - passes timestamp', function() {
      // add fake driver key
      console.log('cache', cache.testCache)
      const oldTimeStamp = new Date().getTime()
      cache.testCache = {
        teams: {
          teamAction: '/team',
          formText: 'Choose a Team',
          selectName: 'team',
          teamsArr: [
            {
              name: 'Some Name',
              name_slug: 'some_name'
            }
          ],
          timestamp: oldTimeStamp
        }
      }
      sinon.spy(utils, 'fetchData')
      return handleTeamsCache(cache.testCache, 30).then(res => {
        //  should match exact cache value
        assert.deepEqual(res, cache.testCache.teams)
        assert(utils.fetchData.notCalled)
        utils.fetchData.restore()
      })
    })
  })
  describe('handleDriversCache()', () => {
    it('handleDriversCache gets data from API - not in cache ', function() {
      sinon.spy(utils, 'fetchData')
      const currentTimeStamp = new Date().getTime()
      return handleDriversCache(cache.testCache, currentTimeStamp).then(res => {
        assert(utils.fetchData.calledOnce)
        // reassign empty cache value
        cache.testCache = utils.resetCache(null, cache.testCache)
        utils.fetchData.restore()
      })
    })
    it('handleDriversCache is empty and adds to cache', function() {
      const currentTimeStamp = new Date().getTime()
      // no drivers key in cache
      assert(!cache.testCache.hasOwnProperty('drivers'))
      return handleDriversCache(cache.testCache, currentTimeStamp).then(res => {
        // key added to cache
        assert(cache.testCache.hasOwnProperty('drivers'))
        cache.testCache = utils.resetCache(null, cache.testCache)
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
      return handleDriversCache(cache.testCache, 30).then(res => {
        assert(utils.fetchData.calledOnce)
        cache.testCache = utils.resetCache(null, cache.testCache)
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
      return handleDriversCache(cache.testCache, 30).then(res => {
        // should match exact cache value
        assert.deepEqual(res, cache.testCache.drivers)
        assert(utils.fetchData.notCalled)
        utils.fetchData.restore()
      })
    })
  })
  describe('handleDriverCache()', () => {
    it('', function() {})
  })
})
