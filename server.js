/*********************************************************************************
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic 
* Policy. No part of this assignment has been copied manually or electronically 
* from any other source (including web sites) or distributed to other students.
*
* Name: Muhammad Ahmed Student 
* ID: 146908207 
* Date: 01-14-2022
*
* Online (Heroku) URL: 
*
********************************************************************************/

const express = require("express");
const app = express();
const path = require("path");

const HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {
    console.log(`Express http server listening on ${HTTP_PORT}`);
}

app.use(express.static("./public"));

app.get("/", function (req, res) {
    res.redirect("/about");
});

app.get("/about", function (req, res) {
    res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.listen(HTTP_PORT, onHttpStart);

