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
    persons:[{name:String}],

    description:{
        type:String
    },
    comments:{
        type: String
    },
    place:{
        type: String
    },
    updated: Date
    
});

module.exports = mongoose.model("Meeting",meetingSchema);