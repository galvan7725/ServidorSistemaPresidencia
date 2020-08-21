'use strict'
const express = require('express');
const authController = require('../controllers/auth');
const userController = require('../controllers/user');
const { allMeetings, newMeeting, meetingUpdateStatus,meetingById ,meetingUpdateTopic, meetingsByDate,getMeetingsByDate} = require('../controllers/Meeting');
//const validator = require('../validator')

const router = express.Router();

router.get("/meetings/all",authController.requireSingin,allMeetings);
router.post("/meetings/new",authController.requireSingin,newMeeting);
router.put("/meeting/update/:topicM/:meetingId",authController.requireSingin,meetingUpdateStatus);
router.get("/meetings/date/:meetingsDate",authController.requireSingin,getMeetingsByDate);

router.param("userId", userController.userById);
router.param("adminId", userController.adminById);
router.param("meetingId", meetingById);
router.param("topicM", meetingUpdateTopic);
router.param("meetingsDate",meetingsByDate);

module.exports = router;