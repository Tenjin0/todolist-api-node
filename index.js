global.Promise = require('bluebird') // eslint-disable-line no-global-assign

const app = require('./server/middleware')

if (!module.parent) {
    app.listen(3000, (err) => {
        if (err) console.error(err)
        app.blipp();
    })
}