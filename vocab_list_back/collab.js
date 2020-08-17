require('dotenv').config()
const converter = require('jp-conversion')
const axios = require('axios')
const { Pool } = require('pg')

const pool = new Pool({
    connectionString: process.env.DB_URI
})

const listAllOperations = async (req, res) => {
    const deckQry = await pool.query(
        'SELECT * FROM koruru_collab.deck WHERE deck_id = $1',
        [req.params.id]
    )

    const qry = await pool.query(
        'SELECT * FROM koruru_collab.operation WHERE deck_id = $1 ORDER BY operation_id ASC',
        [req.params.id]
    )
    res.json({token: deckQry.rows[0].id, name: deckQry.rows[0].name, operations: qry.rows})
}

const listAllOperationsFrom = async (req, res) => {
    const qry = await pool.query(
        'SELECT * FROM koruru_collab.operation WHERE deck_id = $1 and operation_id > $2 ORDER BY operation_id ASC',
        [req.params.id, req.params.fromOp]
    )
    res.json({operations: qry.rows})
}


const addDeck = async (req, res) => {
    const token = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
    const qry = await pool.query(
        'INSERT INTO koruru_collab.deck(id, name) VALUES ($1, $2) RETURNING *',
        [token, req.body.name]
    )
    res.json(qry.rows[0])
} 

const addOperation = async (req, res) => {
    const errors = {}
    if (!req.body?.ignoreCoreDuplicate) {
        const qry = await pool.query(
            'SELECT * FROM core2k WHERE pure_vocab_jp = $1',
            [req.body.vocab_jp]
        )

        if (qry.rowCount > 0) {
            errors.coreDuplicate = qry.rows
        }
    }

    if (!req.body?.ignoreDuplicate) {
        const qry = await pool.query(
            "SELECT * FROM (SELECT * FROM koruru_collab.operation WHERE deck_id = $1 AND word_jp = $2 ORDER BY operation_id DESC LIMIT 1) as subsel WHERE type != 'delete'",
            [req.params.id, req.body.word_jp]
        )

        if (qry.rowCount > 0) {
            errors.operationDuplicate = qry.rows
        }
    }

    if (Object.keys(errors).length) {
        res.status(400).json(errors)
        return
    }

    console.log(req.body)

    try {
        const maxQry = await pool.query(
            'SELECT max(operation_id) as operation_id FROM koruru_collab.operation WHERE deck_id = $1',
            [req.params.id]
        )

        const operation_id = maxQry.rows[0].operation_id + 1

        const qry = await pool.query(
            "INSERT INTO koruru_collab.operation(deck_id, operation_id, type, word_jp, word_en, sentence_jp, sentence_en, pitches) VALUES ($1, $2, 'add', $3, $4, $5, $6, $7) RETURNING *",
            [req.params.id, operation_id, req.body.word_jp, req.body.word_en, req.body.sentence_jp, req.body.sentence_en, JSON.stringify(req.body.pitches)]
        )

        res.json(qry.rows)
    }
    catch (e) {
        console.log(e)
        res.status(400).json({message: "An error occurred, deck id probably doesn't exist."})
    }
}


module.exports = { listAllOperations, listAllOperationsFrom, addDeck, addOperation }
