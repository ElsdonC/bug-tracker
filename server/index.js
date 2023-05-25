require('dotenv').config()
const express = require("express")
const cors = require("cors");
const app = express()
const PORT = process.env.PORT
const pool = require('./db')
const bcrypt = require('bcrypt')

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    const users = await pool.query("SELECT * FROM users")
    res.json({ "users": users.rows[0] })
})

app.post('/register', async (req, res) => {
    const saltRounds = 10
    const first_name = req.body.first_name
    const last_name = req.body.last_name
    const plainTextPassword = req.body.password
    const email = req.body.email
    bcrypt.hash(plainTextPassword, saltRounds, async function(err, hash) {
        if (err) {
            console.log(err)
            res.json("Something went wrong")
            return
        } else {
            await pool.query("INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)",[first_name, last_name, email, hash])
        }
    });
    res.json("Successfully Created Account")
})

app.post('/login', async (req, res) => {
    const email = req.body.email
    const enteredPassword = req.body.password
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email])
    const hash = user.rows[0].password
    bcrypt.compare(enteredPassword, hash, function(err, result) {
        if (err) {
            console.log(err)
        } else if (result == true) {
            res.json("Correct Password")
        } else {
            res.json("Wrong Password")
        }
    })
})

app.listen(PORT || process.env.PORT, () => {
    console.log(`Server running on port ${PORT}`)
})