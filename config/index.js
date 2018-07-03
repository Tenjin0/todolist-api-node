const path = require("path")

module.exports = {
    db: {
        client: 'pg',
        connection: {
          host : process.env.DB_HOST || '127.0.0.1',
          user :  process.env.DB_USER  || 'root',
          password : process.env.DB_USER  || 'test',
          database : 'todolist'
        },
        migrations : {
            directory: path.resolve(__dirname, "..", "db", "migrations")
        },
        seeds: {
            directory: path.resolve(__dirname, "..", "db", "seeds")
        }
    }
}