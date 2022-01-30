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
const blog = require(path.join(__dirname, "/blog-service"));

const HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
    console.log(`Express http server listening on ${HTTP_PORT}`);
}

// the static folder that static resources, like images and css files, can load from
app.use(express.static(path.join(__dirname,"/public")));

// setup a 'route' to listen on the default url path (http:/ / localhost/)
app.get("/", (req, res) => {
    res.redirect("/about");
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.get("/blog", (req, res) => {
    res.json(path.join(__dirname, "/data/posts.json"));
});

app.get("/posts", (req, res) => {
    res.json(path.join(__dirname, "/data/posts.json"));
});
    
app.get("/categories", (req, res) => {
    res.json(null);
});

/* 
This use() will not allow requests to go beyond it so we place it at the end of the file, after the other routes. This function will catch all other requests that don't match any other route handlers declared before it. This means we can use it as a sort of 'catch all' when no route match is found. We use this function to handle 404 requests to pages that are not found.
*/
app.get((req, res) => {
    res.status(404).send("Page Not Found");
});

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHttpStart);

