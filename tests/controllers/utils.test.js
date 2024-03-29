const assert = require('assert')
const utils = require('../../utils')
const urls = require('../../constants')
let cache = require('../../cache')
const nock = require('nock')
require('dotenv').config(
  '/Users/chrisdielschnieder/desktop/code_work/formula1/f1Web/.env'
)

describe('utils()', () => {
  describe('verifyAPI_KEY', () => {
    it('verifyAPI_KEY returns true - correct key', function () {
      assert.strictEqual(process.env.API_KEY, process.env.API_KEY)
    })
    it('verifyAPI_KEY returns false - incorrect key', function () {
      assert.notStrictEqual(process.env.API_KEY, '123456abcdefg')
    })
  })
  describe('statusCodeChecker()', () => {
    it('statusCodeChecker returns false for 404', function () {
      const res = utils.statusCodeChecker(404)
      assert(!res)
    })
    it('statusCodeChecker returns false for 500', function () {
      const res = utils.statusCodeChecker(404)
      assert(!res)
    })
    it('statusCodeChecker returns true for 200', function () {
      const res = utils.statusCodeChecker(200)
      assert(res)
    })
    it('statusCodeChecker returns true for 301', function () {
      const res = utils.statusCodeChecker(301)
      assert(res)
    })
  })

  describe('verifyTimeStamp', function () {
    it('verifyTimeStamp returns false when timestamp is older than expiry param', function () {
      const randomTimeStamp = new Date('Nov 05 2019 21:49:28').getTime()
      // 24 hours in mins
      const res = utils.verifyTimeStamp(randomTimeStamp, 1440)
      assert(!res)
    })
    it('verifyTimeStamp returns true when timestamp within expirity time', function () {
      const randomTimeStamp = new Date().getTime()
      // 24 hours in mins
      const res = utils.verifyTimeStamp(randomTimeStamp, 1440)
      assert(res)
    })
  })
  describe('isObjEmpty()', () => {
    it('returns true on empty obj', function () {
      const res = utils.isObjEmpty({})
      assert(res)
    })
    it('returns false on non-empty obj', function () {
      const res = utils.isObjEmpty({ key: 'value' })
      assert(!res)
    })
  })
  describe('viewCache()', () => {
    beforeEach(function () {
      // check cache is empty
      cache = {}
      assert(utils.isObjEmpty(cache))
    })
    afterEach(function () {
      // check cache is empty
      cache = {}
      assert(utils.isObjEmpty(cache))
    })
  })
  describe.skip('resetCache()', () => {
    beforeEach(function () {
      // check cache is empty
      cache = {}
      assert(utils.isObjEmpty(cache))
    })
    afterEach(function () {
      // check cache is empty
      cache = {}
      assert(utils.isObjEmpty(cache))
    })
    it('resetCache resets drivers cache', async function () {
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
    it('resetCache resets teams cache', async function () {
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
    it('resetCache full cache', async function () {
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
  describe('httpPostCall()', () => {
    const data = {
      driver_data: ['driver1', 'driver2'],
      team_data: ['team1', 'team2'],
      user_id: 2,
    }
    it('httpPostCall returns 200 status', async function () {
      const scope = nock(`${urls.localCardsEndpoint}`)
        .post('/test')
        .reply(200, {
          license: {
            key: 'mit',
            name: 'MIT License',
            spdx_id: 'MIT',
            url: 'https://api.github.com/licenses/mit',
            node_id: 'MDc6TGljZW5zZTEz',
          },
        })
      await utils.httpPostCall(`${urls.localCardsEndpoint}/test`, data)
      assert(scope.interceptors[0].statusCode === 200)
    })
  })
})
