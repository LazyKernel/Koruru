require('dotenv').config()
const creds = require('./credentials')
const bcrypt = require('bcrypt')
const saltRounds = 10

const pool = creds.pool

const checkLoginStatus = async (req, res, next) => {
    if (req.session.loggedin) {
        next()
    }
    else if (req.headers.authorization && req.headers.authorization.startsWith('Basic ')) {
        const buffer = Buffer.from(req.headers.authorization.substring(6), 'base64')
        const header = buffer.toString('utf8')
        const username = header.split(':')[0]
        const password = header.split(':')[1]
        if (username && password) {
            const password_len = Buffer.byteLength(req.body.password, 'utf8')

            if (req.body.password.length < 6 || password_len > 72) {
                res.status(401).json({error: 'Username or password invalid'})
                return
            }

            const result = await pool.query('SELECT * FROM condensed.user WHERE name = $1', [username])
            if (result.rows.length > 0) {
                const user = result.rows[0]
                if (await bcrypt.compare(password, user.password_hash)) {
                    req.session.loggedin = true
                    req.session.username = user.name
                    req.session.user_id = user.id
                    res.json({message: 'Logged in', username: user.name})
                }
                else {
                    res.status(401).json({error: 'Username or password invalid'})
                }
            }
            else {
                res.status(401).json({error: 'Username or password invalid'})
            }
        }
        else {
            res.status(418).json({error: 'No username or password specified'})
        }
    }
    else {
        res.status(401).json({error: 'User not logged in.'})
    }
}

const register = async (req, res) => {
    if (req.body.username && req.body.password) {
        const username = req.body.username

        if (username.length < 3 || username.length > 100) {
            res.status(400).json({error: 'Username not valid'})
            return
        }

        const password_len = Buffer.byteLength(req.body.password, 'utf8')

        if (req.body.password.length < 6 || password_len > 72) {
            res.status(400).json({error: 'Password not valid'})
            return
        }

        const users = await pool.query('SELECT * FROM condensed.user WHERE name = $1', [username])

        if (users.length > 0) {
            res.status(406).json({error: 'Username already exists'})
            return
        }

        const password_hash = await bcrypt.hash(req.body.password, saltRounds)

        const result = await pool.query(
            'INSERT INTO condensed.user ("name", "password_hash") VALUES ($1, $2) RETURNING "name"',
            [username, password_hash]
        )
        
        if (result.rows.length > 0) {
            res.json({message: 'User created successfully'})
        }
        else {
            res.status(500).json({error: 'User could not be created'})
        }
    }
    else {
        res.status(400).json({error: 'Username or password not defined'})
    }
}

const login = async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    if (username && password) {
        const password_len = Buffer.byteLength(req.body.password, 'utf8')

        if (req.body.password.length < 6 || password_len > 72) {
            res.status(401).json({error: 'Username or password invalid'})
            return
        }

        const result = await pool.query('SELECT * FROM condensed.user WHERE name = $1', [username])
        if (result.rows.length > 0) {
            const user = result.rows[0]
            if (await bcrypt.compare(password, user.password_hash)) {
                req.session.loggedin = true
                req.session.username = user.name
                req.session.user_id = user.id
                res.json({message: 'Logged in', username: user.name})
            }
            else {
                res.status(401).json({error: 'Username or password invalid'})
            }
        }
        else {
            res.status(401).json({error: 'Username or password invalid'})
        }
    }
    else {
        res.status(418).json({error: 'No username or password specified'})
    }
}

const logout = async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            res.status(500).json({error: 'An error occurred'})
        }
        else {
            res.json({message: 'Logged out'})
        }
    })
}

module.exports = { checkLoginStatus, register, login, logout }
