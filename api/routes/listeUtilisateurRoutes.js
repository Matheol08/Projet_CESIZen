const express = require('express');
const router = express.Router();

const { getAllUsers } = require('../controllers/listeUtilisateurController'); 
router.get('/utilisateurs', getAllUsers); 

module.exports = router;

