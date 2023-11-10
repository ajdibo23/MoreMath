let mongoose = require("mongoose");
let UserSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        require: true
    },
    math: {
        type: String,
        require: true
    },
    completed: {
        type: Array,
        require: true
    },
    progress: {
        type: Array,
        require: true
    },
    tokens: {
        type: Array,
        require: true
    },
    session: {
        type: String, 
        require: true
    },
    reports: {
        type: Array,
        require: true
    }
});

module.exports = User = mongoose.model("User", UserSchema);