/*********************************************************************************
* WEB322 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic 
* Policy. No part of this assignment has been copied manually or electronically 
* from any other source (including web sites) or distributed to other students.
*
* Name: Muhammad Ahmed Student 
* ID: 146908207 
* Date: 02-15-2022
*
* Online (Heroku) URL: https://floating-shore-36482.herokuapp.com/
*
********************************************************************************/

const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const multer = require("multer");
const upload = multer();
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const stripJs = require("strip-js");
const path = require("path");
const blog = require(path.join(__dirname, "/blog-service"));

cloudinary.config({
    cloud_name: "mahmed224",
    api_key: "737634465147813",
    api_secret: "A1wBCHv3PWT1vOxEy9hZRYVYczU",
    secure: true
});

const HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
const onHttpStart = () => {
    console.log(`Express http server listening on ${HTTP_PORT}`);
}

// tells server how to handle HTML files that are formatted using handlebars by defining any file with the “.hbs” extension (instead of “.html”) to use the handlebars “engine” (template engine)
app.engine('.hbs', exphbs.engine({
    extname: '.hbs',
    helpers: {
        navLink: function (url, options) {
            return '<li' +
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        },
        safeHTML: function (context) {
            return stripJs(context);
        }
    }
}));
app.set('view engine', '.hbs');

// the static folder that static resources, like images and css files, can load from
app.use(express.static(path.join(__dirname, "/public")));
// set the middleware for “urlencoded” form data (normal HTTP Post data)
app.use(express.urlencoded({ extended: true }));
// will add the property 'activeRoute' to 'app.locals' whenever the route changes, ie: if our route is '/blog/5', the app.locals.activeRoute value will be '/blog'. Also, if the blog is currently viewing a category, that category will be set in 'app.locals'.
app.use(function (req, res, next) {
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    app.locals.viewingCategory = req.query.category;
    next();
});

/* ----- SERVER ROUTES ----- */
// setup a 'route' to listen on the default url path (http:/ / localhost/)
app.get("/", (req, res) => {
    res.render("about");
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/blog", (req, res) => {
    blog.getPublishedPosts().then((publishedPosts) => {
        res.json(publishedPosts);
    }).catch((err) => {
        res.json({ message: err });
    });
});

app.get("/posts", (req, res) => {
    if (req.query.category) {
        blog.getPostsByCategory(req.query.category).then((filteredPosts) => {
            res.render("posts", {
                posts: filteredPosts
            });
        }).catch((err) => {
            res.render("posts", { message: err });
        });
    } else if (req.query.minDate) {
        blog.getPostsByMinDate(req.query.minDate).then((filteredPosts) => {
            res.render("posts", {
                posts: filteredPosts
            });
        }).catch((err) => {
            res.render("posts", { message: err });
        });
    } else {
        blog.getAllPosts().then((posts) => {
            res.render("posts", {
                posts: posts
            });
        }).catch((err) => {
            res.render("posts", { message: err });
        });
    }
});

app.get("/post/:id", (req, res) => {
    blog.getPostByID(req.params.id).then((postByID) => {
        res.json(postByID);
    }).catch((err) => {
        res.json({ message: err });
    });
});

app.post("/posts/add", upload.single("featureImage"), (req, res) => {
    if (req.file) {
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };

        async function upload(req) {
            let result = await streamUpload(req);
            console.log(result);
            return result;
        };

        upload(req).then((uploaded) => {
            processPost(uploaded.url);
        });

    } else {
        processPost("");
    }

    function processPost(imageUrl) {
        req.body.featureImage = imageUrl;
        // processes the req.body and adds it as a new Blog Post before redirecting to /posts
        blog.addPost(req.body).then(() => {
            res.redirect("/posts");
        }).catch((err) => {
            res.send("<h1>POST COULD NOT BE MADE AT THIS TIME. PLEASE TRY AGAIN LATER</h1>");
        });
    };
});

app.get("/posts/add", (req, res) => {
    res.render("add-post");
});

app.get("/categories", (req, res) => {
    blog.getCategories().then((categories) => {
        res.render("categories", { categories: categories });
    }).catch((err) => {
        res.render("categories", { message: err });
    });
});

/* 
This use() will not allow requests to go beyond it so we place it at the end of the file, after the other routes. This function will catch all other requests that don't match any other route handlers declared before it. This means we can use it as a sort of 'catch all' when no route match is found. We use this function to handle 404 requests to pages that are not found.
*/
app.use((req, res) => {
    res.status(404).render("not-found");
});



/* ----- CODE TO START THE SERVER ----- */
// If data is initialized successfully in the 'blog-service' module, the promise resolves and the server is started
blog.initialize().then(() => {
    // setup http server to listen on HTTP_PORT
    app.listen(HTTP_PORT, onHttpStart);
}).catch((err) => {
    console.log(err);
});



