const express = require('express');
const router = express.Router();
const webHooks = require('../utils/webHooksContainer')
const CHUNK_SIZE = require('../utils/envStore').chunk_size;

router.post('/', function (req, res, next) {
    webHooks.register(req.body).then(() =>
        webHooks.sendBulkRequest(CHUNK_SIZE));
    return res.json({
        accepted: true,
        accepted_at: Date.now() // JS timestamp
    });
});

module.exports = router;

