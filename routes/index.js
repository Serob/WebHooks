const express = require('express');
const router = express.Router();
const webHooks = require('../utils/webHooksContainer');

router.post('/', function (req, res) {
    webHooks.register(req.body).then(() =>
        webHooks.sendBulkRequest());
    return res.json({
        accepted: true,
        accepted_at: Date.now() // JS timestamp
    });
});

module.exports = router;

