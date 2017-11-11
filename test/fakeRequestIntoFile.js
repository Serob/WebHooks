const fs = require('fs');


const fakeRequest = function (num, param) {
    return new Promise((resolve, reject) => {
        fs.appendFile('requests.txt', num+ " " + param + '\r\n', (err) => {
            if (err || num%3 === 0) reject(num)
            else resolve("Writen")
        })
    })
}

module.exports =  fakeRequest;