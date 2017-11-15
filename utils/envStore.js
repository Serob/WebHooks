const path = require('path');

function Store () {
    this.env = process.env.NODE_ENV || "development";
    this.config = require(path.join(__dirname, '..', 'config', 'config.json'))[this.env];
    this.chunkSize = this.config.webHooks.chunkSize;
    this.failRepeatCount = this.config.webHooks.failRepeatCount;
}

//Some kind of singleton
/*
let stored = null;
function construct() {
    if (!stored) {
        stored = new Store();
    }
    return stored
}*/

module.exports = new Store();
