require('dotenv').config()

module.exports = {
    development: {
        username: process.env.DEV_DB_USERNAME,
        password: process.env.DEV_DB_PASSWORD,
        database: process.env.DEV_DB_NAME,
        host: process.env.DEV_DB_HOSTNAME || '127.0.0.1',
        port: process.env.DEV_DB_PORT || 3306,
        dialect: process.env.DEV_DB_DIALECT || 'mysql',
        dialectOptions: {
            bigNumberStrings: true
        }
    },
    production: {
        "use_env_variable": "JAWSDB_URL",
        "dialect": "mysql"
    }
};