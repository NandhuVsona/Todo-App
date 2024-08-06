const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const ejs = require("ejs");
const cookieParser = require("cookie-parser");
const path = require("path");
const compression = require("compression");
const noCache = require('nocache')

//Middelwares
app.use(express.json());
app.use(compression());
app.use(noCache())
app.set("view-engine", "ejs");
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./Routes/userroute"));
app.use("/api/v1/todo/", require("./Routes/todoroute"));

module.exports = app;
