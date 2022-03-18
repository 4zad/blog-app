const Sequelize = require("sequelize");

let sequelize = new Sequelize("dhjoc13jbdj6i", "rgwexfypmzlweh", "4bb48f797b49d816a784a73cd54b224252213003108f590479d2a453e46c6d72", {
    host: "ec2-3-233-43-103.compute-1.amazonaws.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

// const fs = require("fs");
// const path = require("path");

// var posts = [];
// var categories = [];

module.exports.initialize = () => {
    return new Promise((resolve, reject) => {


        // fs.readFile(path.join(__dirname, "/data/posts.json"), "utf8", (err, data) => {
        //     if (err) { 
        //         reject(`ERROR: Unable to read posts.json and consequently, categories.json as well.\nSYSTEM RESPONSE: ${err}`);
        //     }
        //     else {
        //         posts = JSON.parse(data);

        //         fs.readFile(path.join(__dirname, "/data/categories.json"), "utf8", (err, data) => {
        //             if (err) {
        //                 reject(`ERROR: Unable to read categories.json.\nSYSTEM RESPONSE: ${err}`);
        //             }
        //             else {
        //                 categories = JSON.parse(data);

        //                 resolve();
        //             }                    
        //         });
        //     }
        // });
    });
}

module.exports.getAllPosts = () => {
    return new Promise((resolve, reject) => {
        
        
        // posts.length > 0 ? resolve(posts) : reject("ERROR: No data returned. There may not be any data to display.");
    });
}

module.exports.getPublishedPosts = () => {
    return new Promise((resolve, reject) => {
        
        
        // let publishedPosts = [];

        // posts.forEach((post) => {
        //     if (post.published /*== true*/) publishedPosts.push(post);
        // });

        // publishedPosts.length > 0 ? resolve(publishedPosts) : reject("ERROR: No data returned. There may not be any data to display.");
    });
}

module.exports.getCategories = () => {
    
    
    // return new Promise((resolve, reject) => {
    //     categories.length > 0 ? resolve(categories) : reject("ERROR: No data returned. There may not be any data to display.");
    // });
}

module.exports.addPost = (postData) => {
    return new Promise((resolve, reject) => {
        
        
        // const today = new Date();
        // const dd = String(today.getDate()).padStart(2, '0');
        // const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        // const yyyy = today.getFullYear();
        // postData.postDate = `${yyyy}-${mm}-${dd}`; // date formatted as YYYY-MM-DD
        // postData.published = (postData.published) ? true : false;
        // postData.id = (posts.length + 1);
        // posts.push(postData);
        // resolve(posts[posts.length - 1]);
    });
}

module.exports.getPostsByCategory = (category) => {
    return new Promise((resolve, reject) => {
        
        
        // let filteredPosts = [];

        // posts.forEach((post) => {
        //     if (post.category == category) filteredPosts.push(post);
        // });

        // filteredPosts.length > 0 ? resolve(filteredPosts) : reject(`ERROR: No data returned. There may not be any data to display for the category: ${category}.`);
    });
}

module.exports.getPostsByMinDate = (minDateStr) => {
    return new Promise((resolve, reject) => {
        
        
        // let filteredPosts = [];

        // posts.forEach((post) => {
        //     if (new Date(post.postDate) >= new Date(minDateStr)) filteredPosts.push(post);
        // });

        // filteredPosts.length > 0 ? resolve(filteredPosts) : reject(`ERROR: No data returned. There may not be any data created after the date: ${minDateStr}.`);
    });
}

module.exports.getPostByID = (id) => {
    return new Promise((resolve, reject) => {
        
        
        // let filteredPost = {}; // '{}' used instead of '[]' because we want 'filteredPost' to return a single object, not an array of objects

        // posts.forEach((post) => {
        //     if (post.id == id) filteredPost = post;
        // });

        // filteredPost ? resolve(filteredPost) : reject(`ERROR: No data returned. There may not be any data to display for the ID: ${id}.`);
    });
}


module.exports.getPublishedPostsByCategory = (category) => {
    return new Promise((resolve, reject) => {
        
        
        // let publishedPostsByCategory = [];

        // posts.forEach((post) => {
        //     if (post.category == category && post.published /*== true*/) publishedPostsByCategory.push(post);
        // });

        // publishedPostsByCategory.length > 0 ? resolve(publishedPostsByCategory) : reject("ERROR: No data returned. There may not be any data to display.");
    });
}


