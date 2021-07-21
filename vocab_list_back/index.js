require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Router = require('express-promise-router')
const https = require('https')
const fs = require('fs')
const session = require('express-session')
const pgSession = require('connect-pg-simple')(session)

const creds = require('./credentials')
const static_data = require('./static_data')
const auth = require('./auth')

app = express()
app.use(express.json())

app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: true,
        httpOnly: true,
        secure: app.get('env') === 'production', // set secure for production only
        maxAge: 14 * 24 * 60 * 60 * 1000 // 14 days
    },
    store: new pgSession({
        pool: creds.pool,
        tableName: 'session',
        schemaName: 'condensed'
    })
}))

const router = new Router()
const publicRouter = new Router()

// Routes for getting "static" data
publicRouter.get('/cards/:fromIdx&:numCards', static_data.getCards)
publicRouter.get('/cards/search/:fromIdx&:numCards&:term', static_data.searchCards)
publicRouter.get('/kanji/search/', static_data.searchKanji)
publicRouter.get('/kanji/list', static_data.getKanjiSuggestions)
publicRouter.get('/jisho/:keyword', static_data.jishoProxy)

// Routes for login management
publicRouter.post('/auth/login', auth.login)
router.post('/auth/register', auth.register)
router.get('/auth/logout', auth.logout)

// Routes for interacting with KoruruCollab
// publicRouter.get('/collab/:id', collab.listAllOperations)
// publicRouter.get('/collab/:id&:fromOp', collab.listAllOperationsFrom)
// publicRouter.post('/collab/decks', collab.addDeck)
// publicRouter.post('/collab/operations/:id', collab.addOperation)

app.use(cors())
app.use('/api', publicRouter)
app.use('/api', auth.checkLoginStatus)
app.use('/api', router)

const PORT = process.env.PORT

if (app.get('env') === 'production') {
    const sslOptions = {
        key: fs.readFileSync('/etc/letsencrypt/live/koruru.org/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/koruru.org/fullchain.pem')
    }

    https.createServer(sslOptions, app).listen(PORT)
}
else {
    app.listen(PORT)
}

console.log('Listening on port', PORT)
