require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')
const Router = require('express-promise-router')
const https = require('https')
const fs = require('fs')
const converter = require('jp-conversion')

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

const getSearchQuery = (term) => {
    // Extremely efficient and optimized search engine by yours truly
    let where = "WHERE vocab_jp LIKE $1::text OR vocab_en LIKE $1::text OR japanese LIKE $1::text OR english LIKE $1::text "
    let order = "ORDER BY NOT vocab_jp LIKE $1::text, "
    const interpretations = converter.convert(term)
    console.log(interpretations)
    let jp_arr = []
    if (interpretations.hiragana) {
        jp_arr.push(interpretations.hiragana)
    }
    if (interpretations.katakana) {
        jp_arr.push(interpretations.katakana)
    }
    if (interpretations.kanji) {
        jp_arr.push(interpretations.kanji)
    }

    let combinations = [...jp_arr]
    jp_arr = jp_arr.map(e => e.split(''))
    jp_arr.forEach(e => {
        for (i = 1; i < e.length; i++) {
            combinations.push(e.reduce((p, c, idx) => (idx == i) ? p + ']' + c : p + c, ''))
        }
    })

    combinations.forEach((e, i) => { 
        where += `OR vocab_jp LIKE $${i + 2}::text `
        order += `NOT vocab_jp LIKE $${i + 2}::text, `
    })

    order += "NOT vocab_en LIKE $1::text, due "

    let pagination = `LIMIT $${combinations.length + 2}::integer OFFSET $${combinations.length + 3}::integer`

    return { query: where + order + pagination, combinations: combinations }
}

/*
Currently we have to make sure that index is counting up in the same order as due
(this is done in postgres manually) for offsets to display correctly in frontend 
Due is taken straight from Anki and it is only guaranteed to be in the right order
but there might be (and usually are) gaps between cards
*/

router.get('/api/cards/:fromIdx&:numCards', async (req, res) => {
    const errorMsg = checkLimitOffset(req.params.numCards, req.params.fromIdx)
    if (errorMsg !== null) {
        res.status(400).send(errorMsg)
    }

    const qry = await pool.query(
        'SELECT * FROM core2k ORDER BY due LIMIT $1::integer OFFSET $2::integer',
        [req.params.numCards, req.params.fromIdx]
    )
    res.json(qry.rows)
})

router.get('/api/cards/search/:fromIdx&:numCards&:term', async (req, res) => {
    const errorMsg = checkLimitOffset(req.params.numCards, req.params.fromIdx)
    if (errorMsg !== null) {
        res.status(400).send(errorMsg)
    }

    const searchQry = getSearchQuery(req.params.term)
    console.log(searchQry)
    const qry = await pool.query(
        "SELECT * FROM core2k " +
        searchQry.query,
        [`%${req.params.term}%`, ...searchQry.combinations, req.params.numCards, req.params.fromIdx]
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
