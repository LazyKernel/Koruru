require('dotenv').config()
const express = require('express')
const { Client } = require('pg')
app = express()
const client = new Client()

await client.connect()

app.get('/api/cards/:fromIdx&:numCards', (req, res) => {
    const res = await client.query(
        'SELECT * FROM cards ORDER BY index LIMIT $1::integer OFFSET $2::integer',
        [req.params.numCards, req.params.fromIdx]
    )
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${port}`)
})
