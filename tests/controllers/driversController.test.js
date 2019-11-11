const driversController = require('../../controllers/drivers.controller')
const cacheController = require('../../controllers/cache.controller')
const cache = require('../../cache')
const utils = require('../../utils')
const sinon = require('sinon')
const assert = require('assert')

describe.only('driversController', () => {
  describe('renderAllDriversList()', () => {
    it('renderAllDriversList calls fetchDriver API', function() {
      const mockCtx = {
        query: {
          driver: 'lewis-hamilton'
        },
        // fake render func
        render: function(templateName, options) {
          return
        }
      }
      sinon.spy(driversController, 'fetchDriversAPI')
      return Promise.resolve(
        driversController.renderAllDriversList(mockCtx)
      ).then(res => {
        return Promise.resolve(
          driversController.fetchDriversAPI.returnValues[0]
        ).then(res => {
          return Promise.resolve(res).then(res => {
            // intercepted API call has corret props
            assert(res.hasOwnProperty('driverText'))
            assert(res.hasOwnProperty('selectName'))
            assert(Array.isArray(res.driversArr))
            driversController.fetchDriversAPI.restore()
          })
        })
      })
    })
    it('renderAllDriversList calls render', function() {
      const mockCtx = {
        query: {
          driver: 'lewis-hamilton'
        },
        // fake render func
        render: function(templateName, options) {
          return
        }
      }
      sinon.spy(mockCtx, 'render')
      return Promise.resolve(
        driversController.renderAllDriversList(mockCtx)
      ).then(res => {
        assert(mockCtx.render.calledOnce)
        mockCtx.render.restore()
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
        assert(res.hasOwnProperty('driverData'))
        assert(res.hasOwnProperty('teamData'))
      })
    })
    // need to create endpoint for this to work
    it.skip('fetchDriverAPI returns non-empty team/driver objs - type = page ', function() {
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
    // it('fetchDriverAPI calls handleDriversCache()', function() {
    //   sinon.spy(cacheController, 'handleDriversCache')
    //   const ctx = {
    //     params: {
    //       driver_slug: 'some-driver'
    //     }
    //   }
    //   return driversController.fetchDriverAPI(ctx, 'card').then(res => {
    //     assert(cacheController.handleDriversCache.calledOnce)
    //     cacheController.handleDriversCache.restore()
    //   })
    // })
    // it('fetchDriverAPI calls handleTeamsCache() type = card', function() {
    //   const ctx = {
    //     params: {
    //       driver_slug: 'some-driver'
    //     }
    //   }
    //   sinon.spy(cacheController, 'handleTeamsCache')
    //   return driversController.fetchDriverAPI(ctx, 'card').then(res => {
    //     assert(cacheController.handleTeamsCache.calledOnce)
    //     cacheController.handleTeamsCache.restore()
    //   })
    // })
    // it('fetchDriverAPI calls fetchData() - type = card', function() {
    //   const ctx = {
    //     params: {
    //       driver_slug: 'some-driver'
    //     }
    //   }
    //   sinon.spy(utils, 'fetchData')
    //   return driversController.fetchDriverAPI(ctx, 'card').then(res => {
    //     assert(utils.fetchData.called)
    //     utils.fetchData.restore()
    //   })
    // })
  })
  describe.only('fetchDriversAPI', () => {
    it('fetchDriversAPI returns driversObj and teamsObjZ', function() {
      return driversController.fetchDriversAPI().then(res => {
        assert(res.hasOwnProperty('driversObj'))
        assert(res.hasOwnProperty('teamsObj'))
      })
    })
    it('fetchDriversAPI driversObj has correct props', function() {
      return driversController.fetchDriversAPI().then(res => {
        assert(
          res.driversObj.hasOwnProperty('driversArr') &&
            res.driversObj.hasOwnProperty('driverText') &&
            res.driversObj.hasOwnProperty('selectName')
        )
        assert(res.driversObj.driversArr.length)
      })
    })
    it('fetchDriversAPI teamsObj has correct props', function() {
      return driversController.fetchDriversAPI().then(res => {
        assert(
          res.teamsObj.hasOwnProperty('teamsArr') &&
            res.teamsObj.hasOwnProperty('teamText') &&
            res.teamsObj.hasOwnProperty('selectName')
        )
        assert(res.teamsObj.teamsArr.length)
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
      sinon.spy(driversController, 'compileDriverTemplateResObj')
      return driversController.renderDriverTemplate(mockCtx).then(res => {
        // res obj that is sent with render
        const resObjOutput =
          driversController.compileDriverTemplateResObj.returnValues[0]
        return driversController.fetchDriverAPI(mockCtx, 'page').then(res => {
          const { driverData, teamData, driversObj, teamsObj } = res
          return Promise.resolve(driversObj).then(driversObj => {
            return Promise.resolve(teamsObj).then(teamsObj => {
              const template = driversController.compileDriverTemplateResObj(
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
