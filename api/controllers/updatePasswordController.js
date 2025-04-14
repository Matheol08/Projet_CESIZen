const utilisateur = require('../models/utilisateur');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 

exports.resetPassword = async (req, res) => {
  const { newPassword } = req.body;
  const { userId } = req.params;

  if (!newPassword) {
    return res.status(400).json({ message: "Le mot de passe est requis." });
  }

  if (!userId) {
    return res.status(400).json({ message: "L'ID utilisateur est requis." });
  }

  try {
    const token = req.headers.authorization?.split(' ')[1]; 

    if (!token) {
      return res.status(401).json({ message: 'Token manquant, accès non autorisé' });
    }

  
    const decodedToken = jwt.verify(token, 'ton_secret_key'); 

    if (userId !== userIdFromToken) {
      return res.status(403).json({ message: 'Accès interdit, vous ne pouvez réinitialiser le mot de passe que pour votre propre compte' });
    }

    const user = await utilisateur.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10); 
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Mot de passe réinitialisé avec succès !" });
  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(500).json({ message: "Erreur du serveur." });
  }
};
