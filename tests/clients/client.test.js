const utils = require('../../utils')
const driverClient = require('../../clients/driver.client')
const teamClient = require('../../clients/team.client')
const assert = require('assert')

describe('driverClient()', () => {
  describe('fetchDriver', () => {
    it('fetchs driver lewis-hamilton', async () => {
      const res = await driverClient.fetchDriver('lewis-hamilton')
      assert(res.name_slug === 'lewis-hamilton')
    })
    it('fetchs driver max-verstappen', async () => {
      const res = await driverClient.fetchDriver('max-verstappen')
      assert(res.name_slug === 'max-verstappen')
    })
  })
  describe('fetchDrivers', () => {
    it('fetches all drivers', async () => {
      const arr = await driverClient.fetchDrivers()
      const slugs = arr.map((obj) => Object.values(obj)[1])
      assert(slugs.includes('lewis-hamilton'))
      assert(slugs.includes('max-verstappen'))
      const names = arr.map((obj) => Object.values(obj)[0])
      assert(names.includes('Lewis Hamilton'))
      assert(names.includes('Max Verstappen'))
    })
  })
})

describe.only('teamClient()', () => {
  describe('fetchTeam', () => {
    it('fetchs driver ferrari', async () => {
      const res = await teamClient.fetchTeam('ferrari')
      assert(res.team_name_slug === 'ferrari')
    })
    it('fetchs team mclaren', async () => {
      const res = await teamClient.fetchTeam('mclaren')
      assert(res.team_name_slug === 'mclaren')
    })
  })
  describe('fetchTeams', () => {
    it('fetches all teams', async () => {
      const arr = await teamClient.fetchTeams()
      console.log('arr', arr)

      const slugs = arr.map((obj) => Object.values(obj)[1])
      assert(slugs.includes('mclaren'))
      assert(slugs.includes('haas_f1_team'))
      const names = arr.map((obj) => Object.values(obj)[0])
      assert(names.includes('McLaren F1 Team'))
      assert(names.includes('Haas F1 Team'))
    })
  })
})
