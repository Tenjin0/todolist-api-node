const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });
module.exports = {
    db: {
        client: "pg",
        connection: {
            host: process.env.DB_HOST || "127.0.0.1",
            port: 5432,
            user: process.env.DB_USER || "root",
            password: process.env.DB_PASS || "test",
            database: "todolist"
        },
        migrations: {
            directory: path.resolve(__dirname, "..", "db", "migrations")
        },
        seeds: {
            directory: path.resolve(__dirname, "..", "db", "seeds")
        },
        debug: true
    },
    jwt: {
        secret: process.env.JWT_SECRET || "supersecret"
    }
};
