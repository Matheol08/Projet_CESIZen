const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('mysql://root:root@localhost:3306/cesizen');
const User = require('../models/utilisateur'); // Assure-toi que le modèle est bien importé

const deleteUserAdminController = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    await user.destroy();
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression utilisateur:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

module.exports = deleteUserAdminController;
