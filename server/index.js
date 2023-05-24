require('dotenv').config()
const express = require("express")
const cors = require("cors");
const app = express()
const PORT = process.env.PORT
const pool = require('./db')

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    const users = await pool.query("SELECT * FROM users WHERE user_id = 1")
    res.json({ "users": users.rows[0] })
})

app.post('/user', async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const email = req.body.email
    await pool.query("INSERT INTO users (username, password, email) VALUES ($1, $2, $3)",[username, password, email])
    res.json("Successfully Created Account")
})

app.listen(PORT || process.env.PORT, () => {
    console.log(`Server running on port ${PORT}`)
})