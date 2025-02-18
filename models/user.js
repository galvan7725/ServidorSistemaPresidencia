'use strict'
const mongoose = require('mongoose');
const uuidv1 = require('uuid/v1');
const crypto = require('crypto');
const {ObjectId}  = mongoose.Schema;

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required: true
    },
    email:{
        type: String,
        trim: true,
        required: true
    },
    hashed_password:{
        type: String,
        required: true
    },
    salt: String,
    created:{
        type: Date,
        default: Date.now
    },
    updated: Date,
    photo: {
       type:String
    },
    about:{
        type: String,
        trim: true
    },
        resetPasswordLink: {
            data: String,
            default: ""
        },
        role: {
            type: String,
            required: true
        },
        active:{
            type:String,
            default:"true"
        },
        phone: {
            type: String
        }
    
});

//virtual fields
userSchema.virtual('password').set( function(password){
    //temporary variable called password
    this._password = password;
    //generate a timestamp
    this.salt = uuidv1();
    //encrypt password
    //console.log(password);
    
    this.hashed_password = this.encryptPassword(password);
    
    
}).get(function(){
    return this._password;
});
//methods
userSchema.methods = {
    authenticate: function(plainText){
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    encryptPassword: function(password){
        if(!password){
            return "";
        }
        try {
            console.log("Enc password");
            return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
            
        } catch (err) {
            console.log(err);
            
        }
    }
};


module.exports = mongoose.model("User",userSchema);