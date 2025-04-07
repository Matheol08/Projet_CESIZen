const Menu = require('../models/menu'); 

exports.updateMenu = async (req, res) => {
  const { id } = req.params; 
  const { titre, contenu } = req.body;

  try {
   
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
