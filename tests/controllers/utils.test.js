const assert = require('assert')
const utils = require('../../utils')
const indexController = require('../../controllers/index.controller')
let cache = require('../../cache')

describe('utils tests', () => {
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
      //   console.log('before', cache)
    })
    afterEach(function() {
      // check cache is empty
      cache = {}
      assert(utils.isObjEmpty(cache))
      //   console.log('after', cache)
    })
    it('handleDrivers - checks that cache is not empty after call', async function() {
      let drivers = await indexController.handleDrivers()
      let viewCache = utils.viewCache({})
      assert(!utils.isObjEmpty(viewCache))
      assert(!viewCache.hasOwnProperty('teams'))
    })
    it('handleDrivers - checks that has drivers key', async function() {
      let drivers = await indexController.handleDrivers()
      let viewCache = utils.viewCache({})
      assert(viewCache.hasOwnProperty('drivers'))
    })
    it('handleTeams - checks that has teams key', async function() {
      let drivers = await indexController.handleTeams()
      let viewCache = utils.viewCache({})
      assert(viewCache.hasOwnProperty('teams'))
    })
  })
  describe.only('resetCache()', () => {
    beforeEach(function() {
      // check cache is empty
      cache = {}
      assert(utils.isObjEmpty(cache))
      //   console.log('before', cache)
    })
    afterEach(function() {
      // check cache is empty
      cache = {}
      assert(utils.isObjEmpty(cache))
      //   console.log('after', cache)
    })
    it('resetCache resets drivers cache', async function() {
      let drivers = await indexController.handleDrivers()
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
    it.only('resetCache full cache', async function() {
      let drivers = await indexController.handleDrivers()
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
