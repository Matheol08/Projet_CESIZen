const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/utilisateur'); // Ton modèle User

exports.resetPassword = async (req, res) => {
  const { newPassword } = req.body;

  // Vérifier si le mot de passe est fourni
  if (!newPassword) {
    return res.status(400).json({ message: "Le mot de passe est requis." });
  }

  // Récupérer le token du header Authorization
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token JWT manquant." });
  }

  try {
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, 'ton_secret_key'); // 'ton_secret_key' doit être la clé utilisée lors de la génération du token
    const userId = decoded.userId; // Assure-toi que l'ID de l'utilisateur est stocké dans le token sous 'userId'

    // Trouver l'utilisateur à partir de l'ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe de l'utilisateur
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Mot de passe réinitialisé avec succès !" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur du serveur." });
  }
};
