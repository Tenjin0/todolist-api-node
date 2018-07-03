const bluebird = require('bluebird')
global.Promise = bluebird // eslint-disable-line no-global-assign

const build = require('./server/middleware') 
require('dotenv').load();

if (require.main === module) {
    const app = build({
      logger: {
        level: 'info'
      }
    })
    app.listen(3000, err => {
      if (err) throw err
      app.blipp();
    })
  }
  
  module.exports = build
  
  