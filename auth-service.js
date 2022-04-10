const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

// schema to define a user account 
let userSchema = new Schema({
    "username": {
        "type": String,
        "unique": true
    },
    "password": String,
    "email": String,
    "loginHistory": [
        {
            "dateTime": Date,
            "userAgent": String
        }
    ]
});
// declare variable to hold model of the 'userSchema' schema
let User; // to be defined on creation of new connection in 'initialize' method

// defining the MongoDB database credentials
const dbName = "dbBlogApp";
const dbUsername = "dbUser";
const dbPassword = "dbPassword";

// Defining module methods...
module.exports.initialize = () => {
    return new Promise((resolve, reject) => {
        // create a connection to the MongoDB database, defined in 'db' with the specified connection string sent as an argument
        let db = mongoose.createConnection(`mongodb+srv://${dbUsername}:${dbPassword}@senecaweb.owgrb.mongodb.net/${dbName}?retryWrites=true&w=majority`);

        // verify the 'db' connection
        db.on("error", (err) => {
            reject(err); // reject the promise with the provided error
        });
        db.once("open", () => {
            User = db.model("users", userSchema); // define the user account model using the 'userSchema' schema and associating it with the collection called 'users' on the database
            resolve(`SUCCESS: The operation succeeded at successfully connecting to the '${dbName}' database.`);
        });
    });
}

module.exports.registerUser = (userData) => {
    return new Promise((resolve, reject) => {
        if (userData.password != userData.password2) {
            reject(`ERROR: Passwords do not match.`);
        } else {
            bcrypt.hash(userData.password, 10).then((hash) => { // Hash the password using a Salt that was generated using 10 rounds
                let newUser = new User({
                    username: userData.username,
                    password: hash,
                    email: userData.email,
                    loginHistory: []
                });

                newUser.save((err, newUserData) => {
                    if (err) {
                        if (err == 11000) {
                            reject(`ERROR: The username '${newUserData.username}' is already taken.`);
                        } else {
                            reject(`ERROR: The user could not be created. The following error occurred: \n${err}`);
                        }
                    } else {
                        resolve(`SUCCESS: The following user was successfully created: ${newUserData.username}, ${newUserData.email}.`);
                    }
                });
            }).catch(err => {
                reject(`ERROR: Could not encrypt password. The following error was returned: \n${err}`);
            });
        }
    });
}

module.exports.checkUser = (userData) => {
    return new Promise((resolve, reject) => {
        User.find({
            username: userData.username
        }).exec().then((users) => {
            if (users.length == 0) {
                reject(`ERROR: Unable to find user '${userData.username}'.`);
            } else {
                bcrypt.compare(userData.password, users[0].password).then((match) => {
                    if (match === false) {
                        reject(`ERROR: Incorrect password for user '${userData.username}'.`);
                    } else if (match === true) {
                        if (users[0].loginHistory == null) {
                            users[0].loginHistory = [];
                        }

                        users[0].loginHistory.push({
                            dateTime: (new Date()).toString(), userAgent: userData.userAgent
                        });
                        User.updateOne({
                            username: users[0].username
                        }, {
                            $set: {
                                loginHistory: users[0].loginHistory
                            }
                        }).exec().then(() => {
                            resolve(users[0]);
                        }).catch((err) => {
                            reject(`ERROR: Could not verify user. The following error was returned: \n${err}`);
                        });
                    }
                });
            }
        }).catch(() => {
            reject(`ERROR: Unable to find user, '${userData.username}'.`);
        });
    });
}



