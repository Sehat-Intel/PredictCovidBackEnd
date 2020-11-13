const mongoose = require('mongoose');

const Schema = mongoose.Schema
const UserSchema = new Schema({
    email: String,
    username: String,
    password: String
});


const collectionName = 'users'
const User =  mongoose.model(collectionName, UserSchema);

module.exports = User;