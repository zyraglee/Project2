const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var meanSchema = new Schema({
    userName: {type: String,
        index: true,
        required: true,
        unique: true,
        lowercase: true,
        maxlength: 50},
    password: {type: String,
        required: true},
    firstName: {type: String,
        required: false,
        lowercase: true,
        maxlength: 50},
    lastName: { type: String,
        required: false,
        lowercase: true,
        maxlength: 50},
    profileImage: {type: Buffer,
        required: false},
    interest: { type: String,
        required: false,
        lowercase: true,
        maxlength: 2000}
}, {collection: 'profiles'});

exports.meanSchema = meanSchema;
