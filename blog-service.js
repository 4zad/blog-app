const fs = require("fs");
const path = require("path");

var posts = [];
var categories = [];

module.exports.initialize = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, "/data/posts.json"), "utf8", (err, data) => {
            if (err) { 
                reject(`ERROR: Unable to read posts.json and consequently, categories.json as well.\nSYSTEM RESPONSE: ${err}`);
            }
            else {
                posts = JSON.parse(data);

                fs.readFile(path.join(__dirname, "/data/categories.json"), "utf8", (err, data) => {
                    if (err) {
                        reject(`ERROR: Unable to read categories.json.\nSYSTEM RESPONSE: ${err}`);
                    }
                    else {
                        categories = JSON.parse(data);

                        resolve();
                    }                    
                });
            }
        });
    });
}

module.exports.getAllPosts = () => {
    return new Promise((resolve, reject) => {
        posts.length != 0 ? resolve(posts) : reject("ERROR: No data returned. There may not be any data to display.");
    });
}

module.exports.getPublishedPosts = () => {
    return new Promise((resolve, reject) => {
        let publishedPosts = [];

        posts.forEach((post) => {
            if (post.published /*== true*/) publishedPosts.push(post);
        });

        publishedPosts.length != 0 ? resolve(publishedPosts) : reject("ERROR: No data returned. There may not be any data to display.");
    });
}

module.exports.getCategories = () => {
    return new Promise((resolve, reject) => {
        categories.length != 0 ? resolve(categories) : reject("ERROR: No data returned. There may not be any data to display.");
    });
}

module.exports.addPost = (postData) => {
    return new Promise((resolve, reject) => {
        postData.published = (postData.published) ? true : false;
        postData.id = (posts.length + 1);
        posts.push(postData);
        resolve(posts[posts.length - 1]);
    });
}



// Unit testing on 'initialize' method
/*
const read = (() => {
    return new Promise((resolve,reject) => {
        fs.readFile(path.join(__dirname, "/data/categories.json"), "utf8", (err, data) => {
            categories = JSON.parse(data);
            resolve(categories);
        });
    });
});

myArray = [
    { fName: "Fred", lName: "Flintstone" },
    { fName: "Wilma", lName: "Flintstone" },
    { fName: "Barney", lName: "Rubble" },
];

read().then((array) => {
    console.log(array);
    console.log(typeof (array));
    console.log(typeof (myArray));
});
*/


