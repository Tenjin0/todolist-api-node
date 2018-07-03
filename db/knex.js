const dbconfig = require("../config").db
module.exports = require("knex")(dbconfig)