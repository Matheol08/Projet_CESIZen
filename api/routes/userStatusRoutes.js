const express = require('express');
const userStatusController = require('../controllers/userStatusController'); 
const router = express.Router();

router.get('/', userStatusController.getUserStatus); 

module.exports = router;
