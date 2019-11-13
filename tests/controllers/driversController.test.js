const driversController = require('../../controllers/drivers.controller')
const cacheController = require('../../controllers/cache.controller')
const cache = require('../../cache')
const utils = require('../../utils')
const sinon = require('sinon')
const assert = require('assert')

describe('driversController', () => {
  describe('makeAllDriversObjs()', () => {
    it('makeAllDriversObjs returns obj with correct props', function() {
      const mockCtx = {
        query: {
          driver: 'lewis-hamilton'
        },
        // fake render func
        render: function(templateName, options) {
          return
        }
      }

      return driversController
        .makeAllDriversObjs(mockCtx, mockCtx.query.driver)
        .then(res => {
          assert(res.hasOwnProperty('driver_name'))
          assert(res.hasOwnProperty('flag_img_url'))
          assert(res.hasOwnProperty('main_image'))
        })
    })
  })

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
        return driversController.fetchDriversAPI.returnValues[0].then(res => {
          // intercepted API call has correct props
          assert(res.hasOwnProperty('driversObj'))
          assert(res.hasOwnProperty('teamsObj'))
          // intercepted API call has correct props is not blank
          assert(res.driversObj.driversArr.length)
          assert(res.teamsObj.teamsArr.length)
          driversController.fetchDriversAPI.restore()
        })
      })
    })
    it('renderAllDriversList calls makeAllDriversObjs()', function() {
      const mockCtx = {
        query: {
          driver: 'alexander-albon'
        },
        // fake render func
        render: function(templateName, options) {
          return
        }
      }
      sinon.spy(driversController, 'makeAllDriversObjs')
      return Promise.resolve(
        driversController.renderAllDriversList(mockCtx)
      ).then(res => {
        return driversController.makeAllDriversObjs.returnValues[0].then(
          resOuter => {
            // compare direct call to makeAllDriversObjs and value given inside spy
            // they should be equal if function is correct
            const makeAllDriversObjsCall = driversController.makeAllDriversObjs(
              mockCtx,
              mockCtx.query.driver
            )
            return makeAllDriversObjsCall.then(resInner => {
              // direct call and spied call should be equal
              assert.deepEqual(resInner, resOuter)
              driversController.makeAllDriversObjs.restore()
            })
          }
        )
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
  describe('fetchDriversAPI', () => {
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
          // console.log(res)
          assert(res.hasOwnProperty('driverData'))
          assert(res.hasOwnProperty('teamData'))

          assert(
            !utils.isObjEmpty(res.driverData) && !utils.isObjEmpty(res.teamData)
          )
          driversController.fetchDriverAPI.restore()
        })
      })
    })
    it('renderDriverTemplate gets fetchDriversAPI() data successfully', function() {
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
        driversController.renderDriverTemplate(mockCtx)
      ).then(res => {
        assert(driversController.fetchDriversAPI.calledOnce)
        // resolve promise from inner function
        return Promise.resolve(
          driversController.fetchDriversAPI.returnValues[0]
        ).then(res => {
          assert(res.hasOwnProperty('driversObj'))
          assert(res.hasOwnProperty('teamsObj'))

          assert(
            !utils.isObjEmpty(res.driversObj) && !utils.isObjEmpty(res.teamsObj)
          )
          driversController.fetchDriversAPI.restore()
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
        // call for teamData/driverData
        return driversController.fetchDriverAPI(mockCtx, 'page').then(res => {
          const { driverData, teamData } = res
          // now call for all drivers/teams
          return Promise.resolve(driversController.fetchDriversAPI()).then(
            res => {
              const { driversObj, teamsObj } = res
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
            }
          )
        })
      })
      // TODO
      it.skip('calls fake endpoint', function() {
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
  })
})
