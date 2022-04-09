const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// schema to define a user account 
let userSchema = new Schema({
    "userName": {
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



User = mongoose.model("users", userSchema);
// mongodb+srv://dbUser:dbPassword@senecaweb.owgrb.mongodb.net/dbBlogApp?retryWrites=true&w=majority

