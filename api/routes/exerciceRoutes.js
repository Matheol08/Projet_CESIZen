const express = require('express');
const router = express.Router();
const { getExercices } = require('../controllers/exerciceController');

router.get('/', getExercices); 

module.exports = router;
