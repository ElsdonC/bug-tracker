require('dotenv').config()
const { Pool } = require('pg')

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: process.env.DBPASSWORD,
    port: process.env.DBPORT,
    database: process.env.DB
})

module.exports = pool