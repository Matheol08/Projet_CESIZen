const express = require('express');
const router = express.Router();
const resetPasswordController = require('../controllers/updatePasswordController');


router.post('/resetPassword/:userId', resetPasswordController.resetPassword);

module.exports = router;
