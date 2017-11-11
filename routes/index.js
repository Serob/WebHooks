const express = require('express');
const fakeRequest = require('../test/fakeRequestIntoFile')
const router = express.Router();
const highOrderQueue = [];
const lowOrderQueue = [];
const CHUNK_SIZE = 10;
let number = 0;

/**
 * Handles incoming request,creats apropartiate webHook and saves in a queue
 * @param tempBody Body of incoming request
 * @returns {Promise.<Array>} Queue containing webHooks
 */
async function creteWebHooks(tempBody) {

  //TODO: Hastat async a?
    //hastat!
    const jsonBody = JSON.parse(tempBody)
    for (let url of jsonBody.urls) {
        lowOrderQueue.push({url, data: jsonBody.data});
    }
    return lowOrderQueue;
}

/**
 * Sends several(depending on CHUNK_SIZE) reuests to appropriet URLs
 */
function sendBulkRequest() {
    const requestsLeft = lowOrderQueue.length + highOrderQueue.length;
    const chunkLimit = requestsLeft > CHUNK_SIZE ? CHUNK_SIZE : requestsLeft;
    for (let i = 0; i < chunkLimit; i++) {
        choseQueueToSend();
    }
}

/**
 * Chooses from which queue (higher/lower order) request have to be sent
 */
function choseQueueToSend() {
    if (highOrderQueue.length === 0) {
        sendRequestFrom(lowOrderQueue);
    } else {
        sendRequestFrom(highOrderQueue);
    }
}

/**
 * Send request form the provided queue
 * @param queue Provided queue of webHooks: can be higher or lower order()
 */
function sendRequestFrom(queue) {
    const req = queue.shift();
    fakeRequest(++number, JSON.stringify(req)).then(response => {
        if (highOrderQueue.length || lowOrderQueue.length) {
            choseQueueToSend();
        }
    }).catch(err => {
        req.count = req.count - 1 || 5;
        console.log("faile exav", req.count )
        if (req.count) {
            setTimeout(function () {
                highOrderQueue.push(req); //ba vor el request chekav, es verji pushn exav?
                choseQueueToSend(); //senc?
            }, 5000)
        }
    });
}

router.post('/', function (req, res, next) {
    const tempBody = JSON.stringify(req.body);
    creteWebHooks(tempBody)
        .then(() => sendBulkRequest());
    return res.json({
        accepted: true,
        accepted_at: new Date().getTime() // JS timestamp
    });
});

module.exports = router;

