var express = require("express");
var app = express();
var router = require("./Controller/router");

app.set("view engine", "ejs");

app.use(express.static("./public"));

app.get("/", router.index);

app.post("/submit", router.submit);

app.get("/delete", router.delete);

app.get("/page", router.page);

app.use(function (req, res) {
  res.render("404");
});

app.listen(3000);