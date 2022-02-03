/*********************************************************************************
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic 
* Policy. No part of this assignment has been copied manually or electronically 
* from any other source (including web sites) or distributed to other students.
*
* Name: Muhammad Ahmed Student 
* ID: 146908207 
* Date: 01-25-2022
*
* Online (Heroku) URL: https://floating-shore-36482.herokuapp.com/
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
app.use(express.static(path.join(__dirname, "/public")));

/* ----- SERVER ROUTES ----- */
// setup a 'route' to listen on the default url path (http:/ / localhost/)
app.get("/", (req, res) => {
    res.redirect("/about");
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.get("/blog", (req, res) => {
    blog.getPublishedPosts().then((publishedPosts) => {
        res.json(publishedPosts);
    }).catch((err) => {
        res.json({ message: err });
    });
});

app.get("/posts", (req, res) => {
    blog.getAllPosts().then((posts) => {
        res.json(posts);
    }).catch((err) => {
        res.json({ message: err });
    });
});

app.get("/categories", (req, res) => {
    blog.getCategories().then((categories) => {
        res.json(categories);
    }).catch((err) => {
        res.json({ message: err });
    });
});

/* 
This use() will not allow requests to go beyond it so we place it at the end of the file, after the other routes. This function will catch all other requests that don't match any other route handlers declared before it. This means we can use it as a sort of 'catch all' when no route match is found. We use this function to handle 404 requests to pages that are not found.
*/
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "/views/not-found.html"));
});



/* ----- CODE TO START THE SERVER ----- */
// If data is initialized successfully in the 'blog-service' module, the promise resolves and the server is started
blog.initialize().then(() => {
    // setup http server to listen on HTTP_PORT
    app.listen(HTTP_PORT, onHttpStart);
}).catch((err) => {
    console.log(err);
});


