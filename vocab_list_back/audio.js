require('dotenv').config()
const jsStringEscape = require('js-string-escape')
const { BlobSASPermissions, SASProtocol } = require('@azure/storage-blob')
const moment = require('moment')
const creds = require('./credentials')

const getBlobDownloadLink = async (req, res) => {
    const blobName = jsStringEscape(req.body.blobName)
    const blobClient = creds.blob.getBlobClient(blobName)
    const url = await blobClient.generateSasUrl({
        permissions: BlobSASPermissions.from({ read: true }),
        protocol: SASProtocol.Https,
        contentDisposition: `attachment; filename="${blobName}"`,
        expiresOn: moment().add(1, 'm')
    })
    res.json({url})
}

module.exports = { getBlobDownloadLink }
