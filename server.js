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

