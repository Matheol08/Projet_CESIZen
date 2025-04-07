const utilisateur = require('../models/utilisateur');
const bcrypt = require('bcrypt'); 

exports.resetPassword = async (req, res) => {
  const { newPassword } = req.body;
  const { userId } = req.params;  

  if (!newPassword) {
    return res.status(400).json({ message: "Le mot de passe est requis." });
  }

  if (!userId) {
    return res.status(400).json({ message: "L'ID utilisateur est requis." });
  }

  console.log('ID utilisateur reçu:', userId);  
  console.log('Nouveau mot de passe:', newPassword);  

  try {
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
