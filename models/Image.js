const mongoose = require('mongoose');

const Schema = mongoose.Schema
const ImageSchema = new Schema({
    image_id: String,
    image: String
});


const collectionName = 'images'
const Image =  mongoose.model(collectionName, ImageSchema);

module.exports = Image;