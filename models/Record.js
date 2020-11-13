const mongoose = require('mongoose');

const Schema = mongoose.Schema
const RecordSchema = new Schema({
    email: String,
    username: String,
    image: Buffer,
    status: String,
    percent: String,
    message: String
});


const collectionName = 'records'
const Record =  mongoose.model(collectionName, RecordSchema);

module.exports = Record;