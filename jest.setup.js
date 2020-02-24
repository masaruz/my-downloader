const fs = require("fs-extra")
const constants = require("./src/libs/constants")

afterAll(() => fs.removeSync(constants.BASE.PATH))

jest.setTimeout(60000)