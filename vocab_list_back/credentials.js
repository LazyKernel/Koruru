require('dotenv').config()
const pg = require('pg')
const { BlobServiceClient } = require('@azure/storage-blob')

const pgPool = new pg.Pool({
    connectionString: process.env.DB_URI
})

const blobClient = BlobServiceClient.fromConnectionString(process.env.BLOB_STORAGE_CONN_STRING)

module.exports = { pool: pgPool, blob: blobClient }
