require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')
const Router = require('express-promise-router')
const https = require('https')
const fs = require('fs')
const converter = require('jp-conversion')
const axios = require('axios')

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
    const regex = /nn/gi
    const newTerm = term.replace(regex, 'nnn')
    const interpretations = converter.convert(newTerm)

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

    let combinations = [...jp_arr.map(e => `%${e}%`)]
    combinations.forEach((e, i) => { 
        where += `OR vocab_jp LIKE $${i + 2}::text OR japanese LIKE $${i + 2}::text OR vocab_reading LIKE $${i + 2}::text OR japanese_reading LIKE $${i + 2}::text `
        order += `NOT vocab_jp LIKE $${i + 2}::text, NOT vocab_reading LIKE $${i + 2}::text, `
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
        return
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
        return
    }

    const termLower = req.params.term.toLowerCase()
    const searchQry = getSearchQuery(termLower)

    const qry = await pool.query(
        "SELECT * FROM core2k " +
        searchQry.query,
        [`%${req.params.term}%`, ...searchQry.combinations, req.params.numCards, req.params.fromIdx]
    )
    res.json(qry.rows)
})

router.get('/api/kanji/search/', async (req, res) => {
    if (req.query.term.length <= 0) {
        res.status(400).send('You must include at least one term')
        return
    }

    let query = 'SELECT * FROM kanjidmg_en INNER JOIN kanjidmg USING (nid) WHERE '
    req.query.term.forEach((v, i) => query += ((i === 0) ? '' : 'OR ') + `meaning LIKE $${i + 1}::text `)

    const qry = await pool.query(
        query,
        [...req.query.term.map(v => `${v}`)]
    )
    res.json(qry.rows)
})

router.get('/api/kanji/list', async (req, res) => {
    const qry = await pool.query(
        'SELECT distinct(meaning) FROM kanjidmg_en WHERE NOT has_image'
    )
    res.json(qry.rows.map(v => v['meaning']))
})

router.get('/api/jisho/:keyword', async (req, res) => {
    const result = await axios.get(`https://jisho.org/api/v1/search/words?keyword=${encodeURI(req.params.keyword)}`)
    res.json(result.data)
})

app.use(cors())
app.use('/', router)

const PORT = process.env.PORT
const sslOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/koruru.org/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/koruru.org/fullchain.pem')
}

https.createServer(sslOptions, app).listen(PORT)
