var MongoClient = require('mongodb').MongoClient;
var bson = require('bson');
var DB_CONN_STR = 'mongodb://localhost:27017/test';	

MongoClient.connect(DB_CONN_STR, function(err, db) {
  var collection = db.collection('maning');
  collection.find({First : "Ma"}).toArray(function(err, docs) {
  });
  console.log(collection);
  console.log("连接成功！");
});