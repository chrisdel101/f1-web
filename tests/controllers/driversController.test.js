const driversController = require('../../controllers/drivers.controller')
const teamsController = require('../../controllers/teams.controller')
const cacheController = require('../../controllers/cache.controller')
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
  describe('fetchDriverAPI()', () => {
    it('fetchDriverAPI returns non-empty team/driver objs - type = card ', function() {
      const ctx = {
        params: {
          driver_slug: 'some-driver'
        }
      }
      return driversController.fetchDriverAPI(ctx, 'card').then(res => {
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
      sinon.spy(cacheController, 'handleDriversCache')
      const ctx = {
        params: {
          driver_slug: 'some-driver'
        }
      }
      return driversController.fetchDriverAPI(ctx, 'card').then(res => {
        assert(cacheController.handleDriversCache.calledOnce)
        cacheController.handleDriversCache.restore()
      })
    })
    it('fetchDriverAPI calls handleTeamsCache() type = card', function() {
      const ctx = {
        params: {
          driver_slug: 'some-driver'
        }
      }
      sinon.spy(cacheController, 'handleTeamsCache')
      return driversController.fetchDriverAPI(ctx, 'card').then(res => {
        assert(cacheController.handleTeamsCache.calledOnce)
        cacheController.handleTeamsCache.restore()
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
  describe('renderDriverTemplate()', () => {
    it('renderDriverTemplate gets fetchDriverAPI() data successfully', function() {
      const mockCtx = {
        query: {
          driver: 'lewis-hamilton'
        },
        // fake render func
        render: function(templateName, options) {
          return
        }
      }
      sinon.spy(driversController, 'fetchDriverAPI')
      return Promise.resolve(
        driversController.renderDriverTemplate(mockCtx)
      ).then(res => {
        assert(driversController.fetchDriverAPI.calledOnce)
        // resolve promise from inner function
        return Promise.resolve(
          driversController.fetchDriverAPI.returnValues[0]
        ).then(res => {
          assert(res.hasOwnProperty('driverData'))
          assert(res.hasOwnProperty('teamData'))
          assert(res.hasOwnProperty('teamsObj'))
          assert(res.hasOwnProperty('driversObj'))
          assert(
            !utils.isObjEmpty(res.driverData) &&
              !utils.isObjEmpty(res.teamData) &&
              !utils.isObjEmpty(res.teamsObj) &&
              !utils.isObjEmpty(res.driversObj)
          )
          driversController.fetchDriverAPI.restore()
        })
      })
    })
    it('renderDriverTemplate returns correct template response object', function() {
      const mockCtx = {
        query: {
          driver: 'lewis-hamilton'
        },
        // fake render func
        render: function(templateName, options) {
          return
        }
      }
      sinon.spy(driversController, 'compileTemplateResObj')
      return driversController.renderDriverTemplate(mockCtx).then(res => {
        // res obj that is sent with render
        const resObjOutput =
          driversController.compileTemplateResObj.returnValues[0]
        return driversController.fetchDriverAPI(mockCtx, 'page').then(res => {
          const { driverData, teamData, driversObj, teamsObj } = res
          return Promise.resolve(driversObj).then(driversObj => {
            return Promise.resolve(teamsObj).then(teamsObj => {
              const template = driversController.compileTemplateResObj(
                mockCtx,
                driversObj,
                teamsObj,
                driverData,
                teamData
              )
              // compare direct call to template comiler and value given inside here
              // they should be equal if functions are all correct
              assert.deepEqual(resObjOutput, template)
            })
          })
        })
      })
    })
  })
  // TODO
  it.skip('calls fake endpoint', function() {
    // { request:
    //   { method: 'GET',
    //     url: '/driver?driver=alexander-albon',
    //     header:
    //      { host: 'localhost:3000',
    //        'user-agent': 'curl/7.54.0',
    //        accept: '*/*' } },
    //  response:
    //   { status: 404,
    //     message: 'Not Found',
    //     header: [Object: null prototype] {} },
    //  app: { subdomainOffset: 2, proxy: false, env: 'development' },
    //  originalUrl: '/driver?driver=alexander-albon',
    //  req: '<original node req>',
    //  res: '<original node res>',
    //  socket: '<original node socket>' }
    const ctx = {
      query: {
        driver: 'some-driver'
      }
    }
    return driversController.renderDriverTemplate(ctx).then(res => {
      console.log(res)
    })
  })
})
