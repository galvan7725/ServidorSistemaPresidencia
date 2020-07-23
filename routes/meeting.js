'use strict'
const express = require('express');
const authController = require('../controllers/auth');
const userController = require('../controllers/user');
const { allMeetings, newMeeting } = require('../controllers//Meeting');
//const validator = require('../validator')

const router = express.Router();

router.get("/meetings/all",authController.requireSingin,allMeetings);
router.post("/meeting/new",authController.requireSingin,newMeeting);


router.param("userId", userController.userById);
router.param("adminId", userController.adminById);

module.exports = router;