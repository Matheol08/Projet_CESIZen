const express = require('express');
const router = express.Router();
const deleteUserAdminController = require('../controllers/deleteUserAdminController');

router.delete('/:id', deleteUserAdminController);

module.exports = router;
