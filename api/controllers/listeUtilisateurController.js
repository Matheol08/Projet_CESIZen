const User = require('../models/utilisateur'); // Import du modèle Sequelize

// Fonction pour récupérer la liste des utilisateurs
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll(); // Utilise `findAll()` pour MySQL/Sequelize
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};

module.exports = { getAllUsers };
