const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const ejs = require("ejs");
const cookieParser = require("cookie-parser");
const path = require("path");

//Middelwares
app.use(express.json());
app.set("view-engine", "ejs");
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./Routes/userroute"));
app.use("/api/v1/todo/", require("./Routes/todoroute"));

module.exports = app;
