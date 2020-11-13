const mongoose = require('mongoose');

const Schema = mongoose.Schema
const DoctorSchema = new Schema({
    email: String,
    username: String,
    password: String
});


const collectionName = 'doctors'
const Doctor =  mongoose.model(collectionName, DoctorSchema);

module.exports = Doctor;