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
router.get('/cards/:fromIdx&:numCards', static_data.getCards)
router.get('/cards/search/:fromIdx&:numCards&:term', static_data.searchCards)
router.get('/kanji/search/', static_data.searchKanji)
router.get('/kanji/list', static_data.getKanjiSuggestions)
router.get('/jisho/:keyword', static_data.jishoProxy)

// Routes for interacting with KoruruCollab
router.get('/collab/:id', collab.listAllOperations)
router.get('/collab/:id&:fromOp', collab.listAllOperationsFrom)
router.post('/collab/decks', collab.addDeck)
router.post('/collab/operations/:id', collab.addOperation)

app.use(cors())
app.use('/api', router)

const PORT = process.env.PORT
const sslOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/koruru.org/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/koruru.org/fullchain.pem')
}

https.createServer(sslOptions, app).listen(PORT)
