const express = require('express');
const router = express.Router();
const webHooks = require('../utils/webHooksContainer')
const CHUNK_SIZE = 10;

router.post('/', function (req, res, next) {
    const tempBody = JSON.stringify(req.body);
    webHooks.register(tempBody).then(() =>
        webHooks.sendBulkRequest(CHUNK_SIZE));
    return res.json({
        accepted: true,
        accepted_at: Date.now() // JS timestamp
    });
});

module.exports = router;

