require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')
const Router = require('express-promise-router')
const https = require('https')
const fs = require('fs')

app = express()
const router = new Router()

const pool = new Pool({
    connectionString: process.env.DB_URI
})

const checkLimitOffset = (limit, offset) => {
    if (limit < 0) {
        res.status(400).send()
        return 'Number of cards cannot be negative'
    }

    if (limit > 1000) {
        return 'Max 1000 cards sent at a time'
    }

    if (offset < 0) {
        return 'Offset cannot be negative'
    }

    return null
}

router.get('/api/cards/:fromIdx&:numCards', async (req, res) => {
    const errorMsg = checkLimitOffset(req.params.numCards, req.params.fromIdx)
    if (errorMsg !== null) {
        res.status(400).send(errorMsg)
    }

    const qry = await pool.query(
        'SELECT * FROM cards ORDER BY index LIMIT $1::integer OFFSET $2::integer',
        [req.params.numCards, req.params.fromIdx]
    )
    res.json(qry.rows)
})

router.get('/api/cards/search/:fromIdx&:numCards&:term', async (req, res) => {
    const errorMsg = checkLimitOffset(req.params.numCards, req.params.fromIdx)
    if (errorMsg !== null) {
        res.status(400).send(errorMsg)
    }

    const qry = await pool.query(
        "SELECT * FROM cards " +
        "WHERE vocab_jp LIKE '%$1%' OR vocab_en LIKE '%$1%' OR japanese LIKE '%$1%' OR english LIKE '%$1%' " +
        "ORDER BY index, vocab_jp LIKE '%$1%', vocab_en LIKE '%$1%' " +
        "LIMIT $2::integer OFFSET $3::integer",
        [req.params.term, req.params.numCards, req.params.fromIdx]
    )
    res.json(qry.rows)
})

app.use(cors())
app.use('/', router)

const PORT = process.env.PORT
const sslOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/koruru.org/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/koruru.org/fullchain.pem')
}

https.createServer(sslOptions, app).listen(PORT)
