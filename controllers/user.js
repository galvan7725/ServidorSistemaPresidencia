'use strict'

const User = require('../models/user');
const _ = require('lodash');
const formidable = require('formidable');
const fs = require('fs');
const { uuid } = require('uuidv4');
const path = require('path');


var controller = {

    userById: (req, res, next, id) =>{
        User.findById(id)
        .select('_id name email photo about created active role phone') 
        .exec((err, user) =>{
            if(err || !user){
                return res.status(400).json({
                    error: 'User not found'
                });
            }

            req.profile = user; //Agrega una propiedad llamada profile con la informacion del usuario
            next();
        });
    },
    adminById: (req, res, next, id) =>{
        User.findById(id)
        .select('_id name email photo about created active role') 
        .exec((err, user) =>{
            if(err || !user){
                return res.status(400).json({
                    error: 'User not found'
                });
            }

            req.admin = user; //Agrega una propiedad llamada profile con la informacion del usuario
            next();
        });
    },
    disableUser : (req, res)=>{
        let user = req.profile;
        user.updated = Date.now();
        user.active = "false";
        user.save((err, result) =>{
            if(err){
                return res.status(400).json({
                    error: err
                });
            }else{
            user.hashed_password = undefined;
            user.salt = undefined;
            return res.json(user);
            }
        });

    },
    enableUser : (req, res)=>{
        let user = req.profile;
        user.updated = Date.now();
        user.active = "true";
        user.save((err, result) =>{
            if(err){
                return res.status(400).json({
                    error: err
                });
            }else{
            user.hashed_password = undefined;
            user.salt = undefined;
            return res.json(user);
            }
        });

    },
    
    hasAuthorization: (req, res, next) =>{
        const authorized = req.profile && req.auth && req.profile._id === req.auth._id;

        if(!authorized){
            return res.status(403).json({
                error: "User isnt authorized for this action"
            });
        }
    },
    allUsers: (req, res) =>{
        User.find((err, users) =>{
            if(err){
                return res.status(400).json({
                    error: err
                });
            }
            res.json(users)
        }).select("name email updated created role active");
    },
    getUser: (req, res) =>{
        req.profile.hashed_password = undefined;
        req.profile.salt = undefined;

        return res.json(req.profile);
    },
    updateUser : (req, res, next) =>{
        let form = new formidable.IncomingForm();
        form.keepExtensions= true;
        form.parse(req, (err, fields, files) =>{
            if(err){
                return res.status(400).json({
                    error: "La foto no pudo ser guardada"
                });
            }
            //save user with foto
            const email = req.profile.email;
            User.findOne({email}, (err, user)=>{
                if(err || !user){
                    return res.status(400).json({error: "El usuario no existe"});
                }else{
                    if (!user.authenticate(fields.password1)) {
                        return res.status(401).json({
                            error: "La contraseña no coincide"
                        });
                    }else{
                        console.log("fields",fields);
                        let newUser = req.profile;
                        newUser = _.extend(user, fields);
                        newUser.updated = Date.now();
                        if(fields.phone && !fields.phone.trim() === ""){
                            newUser.phone = fields.phone;
                        }
                        //newUser._id = undefined;
                        if(fields.password2 && !fields.password2.trim() === ""){
                            newUser.password = fields.password2;
                        }
                        
                        if(files.photo){
                            //si existe foto, la guardamos en una carpeta
                            let oldPath = files.photo.path;
                            const photoPath = uuid()+files.photo.name;
                            let newPath = path.join(__dirname,'uploads/avatars')+'/'+ photoPath;
                            let rawData = fs.readFileSync(oldPath);
                            fs.writeFile(newPath,rawData,(err) => {
                                if (err){
                                    console.log("Error:",err);
                                    return res.status(400).json({
                                        error:"No se pudo guardar la imagen"
                                    })
                                }else{
                                    newUser.photo = photoPath;
                                    newUser.save((err, result) =>{
                                        if(err){
                                            return res.status(400).json({
                                                error: err
                                            });
                                        }
                                        user.hashed_password = undefined;
                                        user.salt = undefined;
                                        res.json(user);
                                    });
            
                                }
                            })
                            
                        }else{
                            newUser.save((err, result) =>{
                                if(err){
                                    return res.status(400).json({
                                        error: err
                                    });
                                }
                                user.hashed_password = undefined;
                                user.salt = undefined;
                                res.json(user);
                            });
    
                        }

                       
                    }
                }
            })

            
        });

        /*
        let user = req.profile;

        user = _.extend(user, req.body);
        user.updated = Date.now();
        user.save((err) =>{
            if(err){
                console.log(err);
                
                return res.status(400).json({
                    error: "No estas autorizado para realizar esta accion"
                });
            }
            user.hashed_password = undefined;
            user.salt = undefined;

            res.json({
                user
            });
        });
        */
    },
    deleteUser : (req, res, next) =>{
        let user = req.profile;
        user.remove((err, user) => {
            if(err){
                return res.status(400).json({
                    error: err
                });
            }
            user.hashed_password = undefined;
            user.salt = undefined;

            res.json({
                message: "user delete successfuly"
            });

        });
    },
    userPhoto : (req, res, next) =>{
        if(req.profile.photo){
            //res.set("Content-Type", req.profile.photo.contentType);
            return res.sendFile(path.join(__dirname,'uploads/avatars')+'/'+req.profile.photo);
        }
         next();

    },
    userName : (req,res, next) =>{
        //res.set("Content-Type", "text/plain");
        return res.json(req.profile);
    },
    hasAuthorization : (req, res, next) => {
        let sameUser = req.profile && req.auth && req.profile._id == req.auth._id;
        let adminUser = req.profile && req.auth && req.auth.role === "admin";
     
        const authorized = sameUser || adminUser;
     
        // console.log("req.profile ", req.profile, " req.auth ", req.auth);
        console.log("SAMEUSER", sameUser, "ADMINUSER", adminUser);
     
        if (!authorized) {
            return res.status(403).json({
                error: "User is not authorized to perform this action"
            });
        }
        next();
    },
    addFollowing : (req, res, next) =>{
        User.findByIdAndUpdate(req.body.userId, {$push: {following: req.body.followId}}, (err,result) => {
            console.log(req.body.userId,  req.body.followId);
            if(err){
                return res.status(400).json({
                    error: err
                });
            }
            next();
        });
    },
    addFollower : (req, res) =>{
        User.findByIdAndUpdate(req.body.followId, {$push: {followers: req.body.userId}},
            {new: true}
            
            
            ).populate('following', '_id name')
            .populate('followers', '_id name')
            .exec((err, result) =>{
                if(err){
                    return res.status(400).json({
                        error: err
                    });
                }
                 result.hashed_password = undefined;
                 result.salt = undefined;
                 res.json(result);
            })
    },
    removeFollowing : (req, res, next) =>{
        User.findByIdAndUpdate(req.body.userId, {$pull: {following: req.body.unfollowId}}, (err,result) => {
            if(err){
                return res.status(400).json({
                    error: err
                });
            }
            next();
        });
    },
    removeFollower : (req, res) =>{
        User.findByIdAndUpdate(req.body.unfollowId, {$pull: {followers: req.body.userId}},
            {new: true}
            
            
            ).populate('following', '_id name')
            .populate('followers', '_id name')
            .exec((err, result) =>{
                if(err){
                    return res.status(400).json({
                        error: err
                    });
                }
                 result.hashed_password = undefined;
                 result.salt = undefined;
                 res.json(result);
            })
    },
    findPeople : (req, res) =>{
        let following = req.profile.following;
        following.push(req.profile._id);
        User.find({_id:{$nin: following}}, (err, users)=>{
            if(err){
                return res.status(400).json({
                    error: err
                });

            }
            res.json(users);
        }).select('name');
    },
    catchKeyword : (req, res,next,text) =>{
        req.text=text;
        next();

    },
    searchUser: (req, res)=>{
        const text = req.text;
        User.find({$or:[{noControl: {$regex : "^"+text} },{email: {$regex : "^"+text}},{name: {$regex : "^"+text}}]})
        .select('_id name noControl email') 
        .exec((err, user) =>{
            if(err || !user){
                return res.status(400).json({
                    error: 'User not found'
                });
            }else{
                return res.status(200).json({
                    user:user
                });
            }

        });

        //return res.status(200).json({text:text});
    },
    hasAuthorizationDelete : (req,res,next) =>{
        if(req.admin.role == "admin"){
            next();
        }else{
            res.status(400).json({
                error:"El usuario no tiene autorizacion para realizar esta accion"
            })
        }
    },
    checkVisualitation : (req, res, next)=>{

    }
}

module.exports =controller;