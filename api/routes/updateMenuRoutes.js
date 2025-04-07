const express = require('express');
const router = express.Router();

const { updateMenu } = require('../controllers/updateMenuController');

router.put('/updateMenu/:id', updateMenu);

module.exports = router;
