const User = require('../models/utilisateur');


const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll(); 
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};

module.exports = { getAllUsers };
