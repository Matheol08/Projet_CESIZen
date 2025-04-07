const express = require('express');
const router = express.Router();
const utilisateurController = require('../controllers/createUserAdminController'); 
router.post('/createUtilisateur', utilisateurController.createUtilisateur);

module.exports = router;
