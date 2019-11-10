const teamsController = require('../../controllers/teams.controller')
var assert = require('assert')
const cache = require('../../cache')
const utils = require('../../utils')
const sinon = require('sinon')

const teamDataObj = {
  base: 'Brackley, United Kingdom',
  championship_titles: '5',
  drivers_scraped: [
    { driver_name: 'Lewis  Hamilton', name_slug: 'lewis-hamilton' },
    { driver_name: 'Valtteri Bottas', name_slug: 'valtteri-bottas' }
  ],
  fastest_laps: '61',
  first_team_entry: '1970',
  flag_img_url:
    'https://www.formula1.com//content/fom-website/en/teams/Mercedes/_jcr_content/countryFlag.img.png/1421365156900.png',
  full_team_name: 'Mercedes AMG Petronas Motorsport',
  highest_race_finish: '1 (x88)',
  id: 21,
  logo_url:
    'https://www.formula1.com//content/fom-website/en/teams/Mercedes/_jcr_content/logo.img.jpg/1486740144183.jpg',
  main_image:
    'https://www.formula1.com//content/fom-website/en/teams/Mercedes/_jcr_content/image16x9.img.1536.medium.jpg/1561122939027.jpg',
  podium_finishes: '181',
  pole_positions: '101',
  power_unit: 'Mercedes',
  team_chief: 'Toto Wolff',
  team_name_slug: 'mercedes',
  technical_chief: 'James Allison',
  url_name_slug: 'Mercedes',
  driverFlags: [
    'https://www.formula1.com//content/fom-website/en/drivers/lewis-hamilton/_jcr_content/countryFlag.img.jpg/1536080051510.jpg',
    'https://www.formula1.com//content/fom-website/en/drivers/valtteri-bottas/_jcr_content/countryFlag.img.gif/1423762801690.gif'
  ]
}
describe('teams.controllers', function() {
  describe('combineDriverDataOnTeam()', function() {
    it('runs combineDriverData ', async function() {
      const res = await teamsController.combineDriverDataOnTeam(teamDataObj)
      assert(res.drivers_scraped[0].hasOwnProperty('flag_img_url'))
      assert(res.drivers_scraped[0].hasOwnProperty('api_call'))
    })
  })
  describe('fetchTeamAPI()', function() {
    it('call team API with card render', function() {
      const fakeCtx = {
        params: {
          team_slug: 'mercedes'
        }
      }
      return teamsController.fetchTeamAPI(fakeCtx, 'card').then(res => {
        console.log(res)
      })
    })
  })
  describe('handleTeamsCache()', () => {
    it('handleTeamsCache gets data from API - not in cache ', function() {
      sinon.spy(utils, 'fetchData')
      const currentTimeStamp = new Date().getTime()
      return teamsController
        .handleTeamsCache(cache.testCache, currentTimeStamp)
        .then(res => {
          assert(utils.fetchData.calledOnce)
          utils.fetchData.restore()
          // reassign empty cache value
          cache.testCache = utils.resetCache(null, cache.testCache)
        })
    })
    it('handleTeamsCache is empty and adds to cache', function() {
      const currentTimeStamp = new Date().getTime()
      // no drivers key in cache
      assert(!cache.testCache.hasOwnProperty('teams'))
      return teamsController
        .handleTeamsCache(cache.testCache, currentTimeStamp)
        .then(res => {
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
      return teamsController.handleTeamsCache(cache.testCache, 30).then(res => {
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
      return teamsController.handleTeamsCache(cache.testCache, 30).then(res => {
        // should match exact cache value
        assert.deepEqual(res, cache.testCache.teams)
        assert(utils.fetchData.notCalled)
        utils.fetchData.restore()
      })
    })
  })
})
