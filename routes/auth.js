'use strict'

const express = require('express');
const authController = require('../controllers/auth');
const userController = require('../controllers/user');
const validator = require('../validations')
//const {passwordResetValidator} = require ("../validator");

const router = express.Router();

router.post("/signup/:adminId",[authController.requireSingin,validator.userSingupValidator,userController.hasAuthorizationDelete],authController.singup);
router.post("/singin",authController.singin);
router.get("/singout",authController.singout);
router.get("/users/all/:userId",[authController.requireSingin,userController.hasAuthorization],userController.allUsers);
router.put("/forgot-password", authController.forgotPassword);
router.put("/reset-password", validator.passwordResetValidator, authController.resetPassword);

//social media login
router.post("/social-login", authController.socialLogin); 


router.param("userId", userController.userById);
router.param("adminId",userController.adminById);

module.exports = router;