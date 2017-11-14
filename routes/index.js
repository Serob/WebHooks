const express = require('express');
const router = express.Router();
const webHooks = require('../utils/webHooksContainer')
const chunkSize = require('../utils/envStore').chunkSize;

router.post('/', function (req, res, next) {
    webHooks.register(req.body).then(() =>
        webHooks.sendBulkRequest(chunkSize));
    return res.json({
        accepted: true,
        accepted_at: Date.now() // JS timestamp
    });
});

module.exports = router;

