const Menu = require('../models/menu');
const User = require('../models/utilisateur');
const jwt = require('jsonwebtoken');

exports.updateMenu = async (req, res) => {
  const { id } = req.params;
  const { titre, contenu } = req.body;

  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token manquant, accès non autorisé' });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userIdFromToken = decodedToken.id;

    const user = await User.findByPk(userIdFromToken);
    if (!user || user.id_role !== 1) {
      return res.status(403).json({ message: 'Accès interdit, vous devez être un admin pour modifier un menu' });
    }

    const menu = await Menu.findByPk(id);
    if (!menu) {
      return res.status(404).json({ message: 'Menu non trouvé' });
    }

    menu.titre = titre;
    menu.contenu = contenu;
    await menu.save();

    res.status(200).json({ message: 'Menu mis à jour avec succès', menu });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du menu:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};
