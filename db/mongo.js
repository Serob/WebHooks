const  MongoClient = require('mongodb').MongoClient;


let mongoDB = null;

//use mongomongoDB with service/repository/interface pattern
/*mongoClient.connect(config.mongo.mongoConnectionString, function(err, mongomongoDB) {
    if(err)
        console.log(err)
    else {
        console.log("MongomongoDB connected correctly!");
    }
});*/

exports.get = function () {
    return mongoDB
};

exports.connect = function (url, done) {
    if (mongoDB) return done();
    MongoClient.connect(url, function (err, db) {
        if (err) return done(err);
        mongoDB = db;
        done()
    })
};

exports.close = function (done) {
    if (mongoDB) {
        mongoDB.close(function (err) {
            if (err) return done(err);
            mongoDB = null;
            done()
        })
    }
};