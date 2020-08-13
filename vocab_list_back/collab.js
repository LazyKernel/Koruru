require('dotenv').config()
const converter = require('jp-conversion')
const axios = require('axios')
const { Pool } = require('pg')

const pool = new Pool({
    connectionString: process.env.DB_URI
})

const listAllOperations = async (req, res) => {
    const qry = await pool.query(
        'SELECT * from koruru_collab.operation WHERE deck_id = $1 ORDER BY operation_id ASC',
        [req.params.id]
    )
    res.json(qry.rows)
}

const listAllOperationsFrom = async (req, res) => {
    const qry = await pool.query(
        'SELECT * from koruru_collab.operation WHERE deck_id = $1 and operation_id > $2 ORDER BY operation_id ASC',
        [req.params.id, req.params.fromOp]
    )
    res.json(qry.rows)
}


const addDeck = async (req, res) => {
    const token = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
    const qry = await pool.query(
        'INSERT INTO koruru_collab.deck(id, name) VALUES ($1, $2) RETURNING *',
        [token, req.body.name]
    )
    res.json(qry.rows)
} 

const addOperation = async (req, res) => {
    

    try {
        const qry = await pool.query(
            '',
            [req.params.id]
        )
    }
    catch (e) {

    }
}


export { listAllOperations, listAllOperationsFrom, addDeck, addOperation }
