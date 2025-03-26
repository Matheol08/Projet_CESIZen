const jwt = require('jsonwebtoken');
const { Menu } = require('../models/menu');
const utilisateur = require('../models/utilisateur');

exports.updateMenu = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; 
  
  if (!token) {
    return res.status(401).json({ message: "Token manquant" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await utilisateur.findOne({ where: { id_utilisateur: decoded.id } });

    if (!user || user.id_role !== 1) { 
      return res.status(403).json({ message: "Accès interdit, vous n'êtes pas admin" });
    }

    const { id_menu, titre, contenu } = req.body;

    if (!id_menu) {
      return res.status(400).json({ message: "L'ID du menu est requis" });
    }

    const menu = await Menu.findByPk(id_menu);
    if (!menu) {
      return res.status(404).json({ message: "Menu non trouvé" });
    }

    if (titre) menu.titre = titre;
    if (contenu) menu.contenu = contenu;

    await menu.save();

    res.status(200).json({ message: "Menu mis à jour avec succès", menu });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la mise à jour du menu" });
  }
};
