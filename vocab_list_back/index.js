require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Router = require('express-promise-router')
const https = require('https')
const fs = require('fs')

const static_data = require('./static_data')
const collab = require('./collab')

app = express()
app.use(express.json())
const router = new Router()

// Routes for getting "static" data
router.get('/api/cards/:fromIdx&:numCards', static_data.getCards)
router.get('/api/cards/search/:fromIdx&:numCards&:term', static_data.searchCards)
router.get('/api/kanji/search/', static_data.searchKanji)
router.get('/api/kanji/list', static_data.getKanjiSuggestions)
router.get('/api/jisho/:keyword', static_data.jishoProxy)

// Routes for interacting with KoruruCollab
router.get('/api/collab/:id', collab.listAllOperations)
router.get('/api/collab/:id&:fromOp', collab.listAllOperationsFrom)
router.post('/api/collab/decks', collab.addDeck)
router.post('/api/collab/operations/:id', collab.addOperation)

app.use(cors())
app.use('/', router)

const PORT = process.env.PORT
const sslOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/koruru.org/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/koruru.org/fullchain.pem')
}

https.createServer(sslOptions, app).listen(PORT)
