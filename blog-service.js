const Sequelize = require("sequelize");

// set up sequelize to point to our postgres database
let sequelize = new Sequelize("dhjoc13jbdj6i", "rgwexfypmzlweh", "4bb48f797b49d816a784a73cd54b224252213003108f590479d2a453e46c6d72", {
    host: "ec2-3-233-43-103.compute-1.amazonaws.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

// Defining models...
// 'Post' model
let Post = sequelize.define("Post", {
    body: Sequelize.TEXT,
    title: Sequelize.STRING,
    postDate: Sequelize.DATE,
    featureImage: Sequelize.STRING,
    published: Sequelize.BOOLEAN
}, {
    createdAt: false, // disable createdAt
    updatedAt: false // disable updatedAt
});
// 'Category' model
let Category = sequelize.define("Category", {
    category: Sequelize.STRING
}, {
    createdAt: false, // disable createdAt
    updatedAt: false // disable updatedAt
});

// Defining the relationships between models...
// specifically, the relationship between 'Post' and 'Category'
Post.belongsTo(Category, { foreignKey: "category" });

// Defining module methods...
module.exports.initialize = () => {
    return new Promise((resolve, reject) => {
        // synchronize the database, defined in 'sequelize' with our models and automatically create/add the table(s) that don't exist in the database, to the database
        sequelize.sync().then(() => {
            resolve(`SUCCESS: The operation succeeded. The Database as been synchronized.`);
        }).catch((err) => {
            reject(`ERROR: An unexpected and unknown error occurred. Unable to synchronize with the database successfully.\nSYSTEM RESPONSE: ${err}`);
        });
    });
}

module.exports.getAllPosts = () => {
    return new Promise((resolve, reject) => {
        Post.findAll().then((allPosts) => {
            resolve(allPosts);
        }).catch((err) => {
            reject(`ERROR: No data returned. There may not be any data to display.`);
        });
    });
}

module.exports.getPublishedPosts = () => {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                published: true
            }
        }).then((filteredPosts) => {
            resolve(filteredPosts);
        }).catch((err) => {
            reject(`ERROR: No data returned. There may not be any published data to display.`);
        });
    });
}

module.exports.getCategories = () => {
    return new Promise((resolve, reject) => {
        Category.findAll().then((allCategories) => {
            resolve(allCategories);
        }).catch((err) => {
            reject(`ERROR: No data returned. There may not be any data to display.`);
        });
    });
}

module.exports.addPost = (postData) => {
    return new Promise((resolve, reject) => {
        // ensuring that the 'postDate' property of 'postData' is set to the current date by creating a new 'Date' object
        postData.postDate = new Date();
        // ensuring that the 'published' property of 'postData' is set to a proper boolean value (rather than whatever the form checkbox defined it to be)
        postData.published = (postData.published) ? true : false;
        // ensuring that any blank values ("") for properties of 'postData' are set to null
        for (const property in postData) {
            if (postData[property] == "") {
                postData[property] = null;
            }
        }

        // creating a new entry and uploading 'postData' into the postgresql database
        Post.create({
            body: postData.body,
            title: postData.title,
            postDate: postData.postDate,
            featureImage: postData.featureImage,
            published: postData.published
        }).then(function (createdPost) {
            // you can now access the newly created Project via the variable project
            resolve(`SUCCESS: The following post has been received and uploaded to the database successfully:\n${createdPost}`);
        }).catch(function (error) {
            console.log(`ERROR: An error occurred while attempting to upload the recieved post to the database. The following post could not be uploaded to the database successfully:\n${createdPost}`);
        });
    });
}

module.exports.getPostsByCategory = (category) => {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                category: category
            }
        }).then((filteredPosts) => {
            resolve(filteredPosts);
        }).catch((err) => {
            reject(`ERROR: No data returned. There may not be any data to display for the category: ${category}.`);
        });
    });
}

module.exports.getPostsByMinDate = (minDateStr) => {
    return new Promise((resolve, reject) => {
        const operator = Sequelize.Op; // operator object to define operations and filter through data in 'where' clause of 'Post.findAll' 

        Post.findAll({
            where: {
                postDate: {
                    [operator.gte]: new Date(minDateStr)
                }
            }
        }).then((filteredPosts) => {
            resolve(filteredPosts);
        }).catch((err) => {
            reject(`ERROR: No data returned. There may not be any data created after the date: ${minDateStr}.`);
        });
    });
}

module.exports.getPostByID = (id) => {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                id: id
            }
        }).then((filteredPost) => { 
            resolve(filteredPost[0]); // the 'findAll' method will always return an array and since this method, 'getPostByID', will always only return a single object, we want to ensure that a single object is returned and not an array of objects that only has one element
            // typically in such a situation, '{}' is used instead of '[]' because this will define a variable as a single object, rather than an array of objects
        }).catch((err) => {
            reject(`ERROR: No data returned. There may not be any data to display for the ID: ${id}.`);
        });
    });
}


module.exports.getPublishedPostsByCategory = (category) => {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                published: true,
                category: category
            }
        }).then((filteredPosts) => {
            resolve(filteredPosts);
        }).catch((err) => {
            reject(`ERROR: No data returned. There may not be any published data to display for the category: ${category}.`);
        });
    });
}


