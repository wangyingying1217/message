/**
 * Created by Administrator on 2017-03-21.
 */
var MongoClient = require('mongodb').MongoClient;
var settings = require('../settings');

function _connect(callback) {

  var url = settings.mongodbUrl;
  // Use connect method to connect to the Server
  MongoClient.connect(url, function (err, db) {
    if (err) {
      res.send("数据库连接失败");
      return;
    }
    callback(db);
  });
}


exports.insertOne = function (collectionName, json, callback) {
  _connect(function (db) {
    db.collection(collectionName).insertOne(json, function (err, result) {
      callback(err, result);
      db.close(); //关闭数据库
    })
  });
}

exports.find = function (collectionName, json, c, d) {
  var result = [];
  if (arguments.length == 3) {
    var callback = c;
    var skipnumber = 0;
    var limit = 0;
    var sort = {};
  } else if (arguments.length == 4) {
    var args = c;
    var callback = d;
    var skipnumber = args.pageamount * args.page || 0;
    var limit = args.pageamount || 0;
    var sort = args.sort || {};
  } else {
    throw new Error("find函数的参数个数，必须是3个，或者4个。");
    return;
  }
  // Get the documents collection
  _connect(function (db) {
    var cursor = db.collection(collectionName).find(json).limit(limit).skip(skipnumber).sort(sort);
    cursor.each(function (err, doc) {
      if (err) {
        callback(err, null);
        db.close(); //关闭数据库
        return;
      }
      if (doc != null) {
        result.push(doc);
      } else {
        callback(null, result);
        db.close(); //关闭数据库
      }
    });
  });
}

exports.deleteMany = function (collectionName, json, callback) {
  _connect(function (db) {
    db.collection(collectionName).deleteMany(json, function (err, result) {
      callback(err, result);
      db.close(); //关闭数据库
    });
  });
}

exports.updateMany = function (collectionName, json1, json2, callback) {
  _connect(function (db) {
    db.collection(collectionName).updateMany(json1, json2, function (err, result) {
      callback(err, result);
      db.close(); //关闭数据库
    })
  });
}

exports.getAllCount = function (collectionName,json,callback) {
  _connect(function ( db) {
    db.collection(collectionName).count(json).then(function(count) {
      callback(count);
      db.close();
    });
  })
}