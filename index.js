import bluebird from 'bluebird'

global.Promise = bluebird // eslint-disable-line no-global-assign

import app from './server/middleware'

if (!module.parent) {
    app.listen(3000, (err) => {
        if (err) console.error(err)
        app.blipp();
    })
}
