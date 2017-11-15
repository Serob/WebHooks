const express = require('express');
const app = express();
const http = require('http');
const bodyParser = require('body-parser');

const port = '3001';

const server = http.createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); 

async function timeout() {
    return new Promise(resolve => setTimeout(resolve, 500));
}

app.post('/', function (req, res) {
    console.log('Ok:', req.body);
    server.getConnections(function (error, count) {
        console.log("Active connections:", count);
    });
    timeout().then(_ => {
        res.send('ok');
    })
});

app.post('/fail', function (req, res) {
    console.log('Fail',req.body);
    server.getConnections(function(error, count) {
        console.log("Active connections:", count);
    });
    timeout().then( _ => {
        res.sendStatus(418); //teaPot :)
    })
});

server.listen(port, function () {
    console.log('app listening on port 3001!');
});