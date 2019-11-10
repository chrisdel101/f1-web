const driversController = require('../../controllers/drivers.controller')
const teamsController = require('../../controllers/teams.controller')
const cache = require('../../cache')
const utils = require('../../utils')
const sinon = require('sinon')
const assert = require('assert')

describe('driversController', () => {
  describe('handleDriversCache()', () => {
    it('handleDriversCache gets data from API - not in cache ', function() {
      sinon.spy(utils, 'fetchData')
      const currentTimeStamp = new Date().getTime()
      return driversController
        .handleDriversCache(cache.testCache, currentTimeStamp)
        .then(res => {
          assert(utils.fetchData.calledOnce)
          utils.fetchData.restore()
          // reassign empty cache value
          cache.testCache = utils.resetCache(null, cache.testCache)
        })
    })
    it('handleDriversCache is empty and adds to cache', function() {
      const currentTimeStamp = new Date().getTime()
      // no drivers key in cache
      assert(!cache.testCache.hasOwnProperty('drivers'))
      return driversController
        .handleDriversCache(cache.testCache, currentTimeStamp)
        .then(res => {
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
      return driversController
        .handleDriversCache(cache.testCache, 30)
        .then(res => {
          assert(utils.fetchData.calledOnce)
          utils.fetchData.restore()
          cache.testCache = utils.resetCache(null, cache.testCache)
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
          // should match exact cache value
          assert.deepEqual(res, cache.testCache.drivers)
          assert(utils.fetchData.notCalled)
          utils.fetchData.restore()
        })
    })
  })
  describe.only('fetchDriverAPI()', () => {
    it.only('fetchDriverAPI returns non-empty team/driver objs - type = card ', function() {
      const ctx = {
        params: {
          driver_slug: 'some-driver'
        }
      }
      return driversController.fetchDriverAPI(ctx, 'card').then(res => {
        console.log(res.driversObj)
        assert(res.driversObj)
        assert(res.teamsObj)
      })
    })
    it('fetchDriverAPI returns non-empty team/driver objs - type = page ', function() {
      const ctx = {
        query: {
          driver: 'some-driver'
        }
      }
      return driversController.fetchDriverAPI(ctx, 'page').then(res => {
        assert(res.driversObj)
        assert(res.teamsObj)
      })
    })
    // TODO
    it.skip('fetchDriverAPI works with test endpoint', function() {
      const ctx = {
        query: {
          driver: 'some-driver'
        }
      }
      return driversController.fetchDriverAPI(ctx, 'page').then(res => {
        console.log(res)
      })
    })
    it('fetchDriverAPI calls handleDriversCache()', function() {
      sinon.spy(driversController, 'handleDriversCache')
      const ctx = {
        params: {
          driver_slug: 'some-driver'
        }
      }
      return driversController.fetchDriverAPI(ctx, 'card').then(res => {
        assert(driversController.handleDriversCache.calledOnce)
        driversController.handleDriversCache.restore()
      })
    })
    it('fetchDriverAPI calls handleTeamsCache() type = card', function() {
      const ctx = {
        params: {
          driver_slug: 'some-driver'
        }
      }
      sinon.spy(teamsController, 'handleTeamsCache')
      return driversController.fetchDriverAPI(ctx, 'card').then(res => {
        assert(teamsController.handleTeamsCache.calledOnce)
        teamsController.handleTeamsCache.restore()
      })
    })
    it('fetchDriverAPI calls fetchData() - type = card', function() {
      const ctx = {
        params: {
          driver_slug: 'some-driver'
        }
      }
      sinon.spy(utils, 'fetchData')
      return driversController.fetchDriverAPI(ctx, 'card').then(res => {
        assert(utils.fetchData.called)
        utils.fetchData.restore()
      })
    })
  })
})
