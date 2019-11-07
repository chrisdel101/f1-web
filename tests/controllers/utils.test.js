const assert = require('assert')
const utils = require('../../utils')
const indexController = require('../../controllers/index.controller')
let cache = require('../../cache')
const sinon = require('sinon')

describe('utils tests', () => {
  describe('getSelectedData()', () => {
    it('returns drivers data from cache', async function() {
      const fakeCache = {
        drivers: [
          { name: 'Test Driver1', name_slug: 'test-driver1' },
          { name: 'Test Driver2', name_slug: 'test-driver2' }
        ]
      }
      sinon.spy(utils, 'fetchData')
      const result = await utils.getData(fakeCache, 'drivers')
      //   check not called from DB
      assert(utils.fetchData.notCalled)
      assert.deepEqual(result, fakeCache.drivers)
      utils.fetchData.restore()
    })
    it('returns drivers team from cache', async function() {
      const fakeCache = {
        teams: [
          { name: 'Test Team1', name_slug: 'test-team1' },
          { name: 'Test Team2', name_slug: 'test-team2' }
        ]
      }
      sinon.spy(utils, 'fetchData')
      const result = await utils.getData(fakeCache, 'teams')
      //   check not called from DB
      assert(utils.fetchData.notCalled)
      assert.deepEqual(result, fakeCache.teams)
      utils.fetchData.restore()
    })
    it('attempt fetch drivers from DB - incorrect cache key returns error', async function() {
      const fakeCache = {
        teams: [
          { name: 'Test Team1', name_slug: 'test-team1' },
          { name: 'Test Team2', name_slug: 'test-team2' }
        ]
      }
      sinon.spy(utils, 'fetchData')
      const result = await utils.getData(fakeCache, 'blarg')
      //   check not called from DB
      assert.throws(() => {
        throw new SyntaxError()
      })
      utils.fetchData.restore()
    })
    it('attempt fetch drivers from DB - incorrect cache key returns error', async function() {
      const fakeCache = {}
      sinon.spy(utils, 'fetchData')
      //   get from DB
      const result = await utils.getData(fakeCache, 'teams')
      //   check is called from DB
      assert(utils.fetchData.calledOnce)
      utils.fetchData.restore()
    })
  })
  describe('isObjEmpty()', () => {
    it('returns true on empty obj', function() {
      const res = utils.isObjEmpty({})
      assert(res)
    })
    it('returns false on non-empty obj', function() {
      const res = utils.isObjEmpty({ key: 'value' })
      assert(!res)
    })
  })
  describe('viewCache()', () => {
    beforeEach(function() {
      // check cache is empty
      cache = {}
      assert(utils.isObjEmpty(cache))
    })
    afterEach(function() {
      // check cache is empty
      cache = {}
      assert(utils.isObjEmpty(cache))
    })
    it('handleDriversCache - checks that cache is not empty after call', async function() {
      let drivers = await indexController.handleDriversCache()
      let viewCache = utils.viewCache({})
      assert(!utils.isObjEmpty(viewCache))
    })
    it('handleDriversCache - checks that has drivers key', async function() {
      let drivers = await indexController.handleDriversCache()
      let viewCache = utils.viewCache({})
      assert(viewCache.hasOwnProperty('drivers'))
    })
    it('handleTeams - checks that has teams key', async function() {
      let drivers = await indexController.handleTeams()
      let viewCache = utils.viewCache({})
      assert(viewCache.hasOwnProperty('teams'))
    })
  })
  describe('resetCache()', () => {
    beforeEach(function() {
      // check cache is empty
      cache = {}
      assert(utils.isObjEmpty(cache))
    })
    afterEach(function() {
      // check cache is empty
      cache = {}
      assert(utils.isObjEmpty(cache))
    })
    it('resetCache resets drivers cache', async function() {
      let drivers = await indexController.handleDriversCache()
      let viewCache = utils.viewCache(null, 'drivers')
      //   check array of drivers
      assert(Array.isArray(viewCache))
      //   check some items in array
      assert(viewCache.length > 0)
      utils.resetCache('drivers')
      //   reinsantiate
      viewCache = utils.viewCache(null, 'drivers')
      assert(!viewCache.hasOwnProperty('drivers'))
      assert(utils.isObjEmpty(viewCache))
    })
    it('resetCache resets teams cache', async function() {
      let teams = await indexController.handleTeams()
      let viewCache = utils.viewCache(null, 'teams')
      //   check array of drivers
      //   check some items in array
      assert(viewCache.length > 0)
      assert(Array.isArray(viewCache))
      utils.resetCache('teams')
      //   reinsantiate
      viewCache = utils.viewCache(null, 'teams')
      assert(!viewCache.hasOwnProperty('teams'))
      assert(utils.isObjEmpty(viewCache))
    })
    it('resetCache full cache', async function() {
      let drivers = await indexController.handleDriversCache()
      let teams = await indexController.handleTeams()
      let viewCache = utils.viewCache()
      //   check cache was filled
      assert(viewCache.hasOwnProperty('drivers'))
      assert(viewCache.hasOwnProperty('teams'))
      utils.resetCache()
      //   reinsantiate
      viewCache = utils.viewCache()
      //   check emptied
      assert(!viewCache.hasOwnProperty('teams'))
      assert(utils.isObjEmpty(viewCache))
    })
  })
})
