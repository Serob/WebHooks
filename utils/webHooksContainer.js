const express = require('express');
const fakeRequest = require('../test/fakeRequest')
const rp = require('request-promise');

//--------------- privates ------------------

const highOrderQueue = [];
const lowOrderQueue = [];

/**
 * Chooses from which queue (higher/lower order) request have to be sent
 */
function sendRequestFromQueues(repeatTime = 5) {
    if (highOrderQueue.length === 0)
        sendRequestFrom(lowOrderQueue, repeatTime);
    else
        sendRequestFrom(highOrderQueue, repeatTime);
}

function optionsCreator(req){
    return {
        uri: req.url,
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        //or just body: req.data
        body: {
            data: req.data
        },
        json:true
    }
}
/**
 * Send request form the provided queue
 * @param queue Provided queue of webHooks from which request should be sent: can be higher or lower order()
 * @param repeatTime Repeat time after failure (in seconds)
 */
function sendRequestFrom(queue, repeatTime = 5) {
    const req = queue.shift();
    const db = require('../db/mongo').get();
    rp(optionsCreator(req))
        .then(parsedBody => {
            console.log(parsedBody.status);
            if (highOrderQueue.length || lowOrderQueue.length) {
                sendRequestFromQueues(repeatTime); //try another one
            }
            db.collection("success").insertOne(req).then( ()=>{
                console.log("inserted as ok:", req.url);
            })
        })
        .catch(function (err) {
            req.count = req.count - 1 || 6;
            if (req.count > 1) {
                setTimeout(function () {
                    highOrderQueue.push(req);
                    sendRequestFromQueues(repeatTime);
                }, repeatTime * 1000)
            } else {
                delete req.count;
                req.responseStatus = err.statusCode;
                db.collection("fail").insertOne(req).then( ()=>{
                    console.log("inserted as fail:", req.url);
                })
            }
        });

/*    fakeRequest(JSON.stringify(req)).then(response => {
        console.log(response.message);
        if (highOrderQueue.length || lowOrderQueue.length) {
            sendRequestFromQueues(); //try another one
        }
        db.collection("success").insertOne(req).then( ()=>{
            console.log("inserted as ok", req);
        })
    }).catch(err => {
        req.count = req.count - 1 || 6;
        if (req.count > 1) {
            //console.log(err, req.count);
            setTimeout(function () {
                highOrderQueue.push(req);
                sendRequestFromQueues();
            }, repeatTime * 1000)
        } else {
            delete req.count
            db.collection("fail").insertOne(req).then( ()=>{
                console.log("inserted as fail", req);
            })
        }
    });*/
}

//--------------- publics ------------------
function WebHooksContainer () {}

/**
 * Asynchronously handles incoming request, creats apropartiate webHooks and saves them in a queue
 * @param tempBody Body of incoming request
 * @returns {Promise.<Array>} Queue containing webHooks
 */
WebHooksContainer.prototype.register = async function(jsonBody) {
    for (let url of jsonBody.urls) {
        lowOrderQueue.push({url, data: jsonBody.data});
    }
    return lowOrderQueue;
}

/**
 * Sends several(depending on bulkSize) reuests to appropriet URLs
 * @param bulkSize The size of simultaneously sent requests
 */
WebHooksContainer.prototype.sendBulkRequest = function(bulkSize) {
    const requestsLeft = lowOrderQueue.length + highOrderQueue.length;
    const bulkLimit = requestsLeft > bulkSize ? bulkSize : requestsLeft;
    for (let i = 0; i < bulkLimit; i++) {
        sendRequestFromQueues(1);
    }
}

module.exports = new WebHooksContainer();