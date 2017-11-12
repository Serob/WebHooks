const path = require('path');
let n=0;
function Store () {
    this.env = process.env.NODE_ENV || "development";
    this.config = require(path.join(__dirname, '..', 'config', 'config.json'))[this.env];
    this.chunk_size = this.config.chunk_size;
}

//Some kind of singleton
//tests show no need in this
/*
let stored = null;

function construct() {
    if (!stored) {
        stored = new Store();
    }
    return stored
}*/

module.exports = new Store();