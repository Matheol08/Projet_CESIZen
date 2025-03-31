const express = require('express');
const router = express.Router();
const { resetPassword } = require('../controllers/updatePasswordController'); // Assure-toi que le chemin est correct

// Route pour réinitialiser le mot de passe
router.post('/', resetPassword); // resetPassword est la fonction que tu as définie dans le contrôleur

module.exports = router;
