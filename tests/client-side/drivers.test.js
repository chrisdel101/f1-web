import { sum } from '../../javascripts/drivers'
describe('sum', function() {
  it('should return sum of arguments', function() {
    chai.expect(sum(1, 2)).to.equal(3)
  })
})
