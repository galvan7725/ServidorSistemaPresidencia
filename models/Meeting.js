'use strict'
const mongoose = require('mongoose');
const {ObjectId}  = mongoose.Schema;

const meetingSchema = new mongoose.Schema({
    user:{
        type: ObjectId,
        ref: 'User'
    },
    dateM:{
        type:Date,
        required: true
    },
    status:{
        type: String,
        default:"pending"
    },
    comments:{
        type: String
    },
    updated: Date
    
});

module.exports = mongoose.model("Meeting",meetingSchema);