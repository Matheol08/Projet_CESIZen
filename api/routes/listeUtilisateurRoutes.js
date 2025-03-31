// routes/listeUtilisateurRoutes.js
const express = require('express');
const router = express.Router();

// Importez correctement la fonction du contrôleur
const { getAllUsers } = require('../controllers/listeUtilisateurController'); // Vérifiez que le chemin est correct

// Définir la route et l'associer à la fonction du contrôleur
router.get('/utilisateurs', getAllUsers); // Assurez-vous que la fonction est bien passée en paramètre

module.exports = router;

