require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')
const Router = require('express-promise-router')

app = express()
const router = new Router()

const pool = new Pool({
    connectionString: process.env.DB_URI
})

router.get('/api/cards/:fromIdx&:numCards', async (req, res) => {
    if (req.params.numCards < 0) {
        res.status(400).send('Number of cards cannot be negative')
        return
    }

    if (req.params.numCards > 1000) {
        res.status(400).send('Max 1000 cards sent at a time')
        return
    }

    if (req.params.fromIdx < 0) {
        res.status(400).send('Offset cannot be negative')
        return 
    }

    const qry = await pool.query(
        'SELECT * FROM cards ORDER BY index LIMIT $1::integer OFFSET $2::integer',
        [req.params.numCards, req.params.fromIdx]
    )
    res.json(qry.rows)
})

app.use(cors())
app.use('/', router)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
