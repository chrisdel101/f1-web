const api = require("../../API/index")

describe.skip("API tests", () => {
  it("sendUserDatatoDB()", () => {
    it("sendUserDatatoDB sends POST to DB", function() {})
  })
  it("sendImagetoMsgr()", () => {
    it("sendImagetoMsgr takes mobile driver image", function() {
      const mockCtx = {
        path: "https://f1-cards.herokuapp.com/api/mobile/driver/max-verstappen",
        params: {
          team_slug: "red_bull_racing",
          driver_slug: "max-verstappen"
        }
      }
      return api.sendImagetoMsgr(mockCtx, "driver").then(res => {
        // console.log(res)
      })
    })
    it("sendImagetoMsgr takes mobile driver image", async function() {
      const mockCtx = {
        path: "https://f1-cards.herokuapp.com/api/team/mercedes",
        params: {
          team_slug: "mercedes",
          driver_slug: "max-verstappen"
        }
      }
      return Promise.resolve(api.sendImagetoMsgr(mockCtx, "team")).then(res => {
        console.log(res)
      })
    })
  })
})
