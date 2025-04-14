const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('mysql://root:root@localhost:3306/cesizen');
const User = require('../models/utilisateur');
const jwt = require('jsonwebtoken');

const deleteUserAdminController = async (req, res) => {
  try {
    
    const token = req.headers.authorization?.split(' ')[1]; 

    if (!token) {
      return res.status(401).json({ message: 'Token manquant, accès non autorisé' });
    }

  
    const decodedToken = jwt.verify(token, 'ton_secret_key'); 
    const userIdFromToken = decodedToken.id;

    const user = await User.findByPk(userIdFromToken);
    if (!user || user.id_role !== 1) {
      return res.status(403).json({ message: 'Accès interdit, vous devez être un admin pour supprimer un utilisateur' });
    }

    const { id } = req.params;
    const userToDelete = await User.findByPk(id);

    if (!userToDelete) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    await userToDelete.destroy();
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression utilisateur:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

module.exports = deleteUserAdminController;
