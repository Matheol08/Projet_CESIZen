const Menu = require('../models/menu'); 

exports.getMenus = async (req, res) => {
  try {
    const menus = await Menu.findAll(); 
    res.json({ 
      data: menus,
      message: 'Menus récupérés avec succès 2'
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des menus :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
