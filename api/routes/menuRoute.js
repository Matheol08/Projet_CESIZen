const express = require('express');
const router = express.Router();
const { updateMenu } = require('../controllers/updateMenuController');
const menuController = require('../controllers/menuController');

router.put('/menu/update', updateMenu);
router.get('/menu', menuController.getMenus); 

module.exports = router;
