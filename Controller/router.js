/**
 * Created by Administrator on 2017-03-21.
 */
var db = require("../model/db");
var ObjectID = require('mongodb').ObjectID;
var formidable = require("formidable");

exports.index = function (req, res, next) {
  db.find("info", {}, {"pageamount": 3, "page": 0, "sort": {"time": -1},}, function (err, result) {
    if (err) {
      next();
      return;
    }
    db.getAllCount("info", {}, function (count) {
      res.render("index", {message: result, page: Math.ceil(count / 3)});
    })
  });
}

exports.submit = function (req, res, next) {
  var form = new formidable.IncomingForm();

  form.parse(req, function (err, fields, files) {
    if (err) {
      next();
      return;
    }
    db.insertOne("info", fields, function (err, result) {
      if (err) {
        res.send(false);
        return;
      }
      db.getAllCount("info", {}, function (count) {
        res.json({_id:result.insertedId,page:Math.ceil(count / 3)});
      })
    })
  });
}

exports.page = function (req, res) {
  var page = parseInt(req.query.page);
  db.find("info", {}, {"pageamount": 3, "page": page, "sort": {"time": -1},}, function (err, result) {
    if (err) {
      next();
      return;
    }
    res.json(result);
  });
}

exports.delete = function (req, res) {
  var id = req.query.id;
  db.deleteMany("info", {"_id": ObjectID(id)}, function (err, result) {
    if (err) {
     next();
     return;
     }
    res.send(true);
  });
}