require('dotenv').config()
const express = require('express')
const { Pool } = require('pg')
const Router = require('express-promise-router')
app = express()
const router = new Router()

const pool = new Pool({
    connectionString: process.env.DB_URI
})

router.get('/api/cards/:fromIdx&:numCards', async (req, res) => {
    const qry = await pool.query(
        'SELECT * FROM cards ORDER BY index LIMIT $1::integer OFFSET $2::integer',
        [req.params.numCards, req.params.fromIdx]
    )
    res.json(qry.rows)
})

app.use('/', router)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
