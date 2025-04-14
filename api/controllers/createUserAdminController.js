const Utilisateur = require('../models/utilisateur');
const bcrypt = require('bcrypt');

exports.createUtilisateur = async (req, res) => {
  const { nom, prenom, password, role } = req.body;

  if (!req.user || req.user.id_role !== 1) {
    return res.status(403).json({ message: 'Accès refusé. Seuls les admins peuvent créer un utilisateur.' });
  }

  if (!nom || !prenom || !password || !role) {
    return res.status(400).json({ message: 'Veuillez remplir tous les champs' });
  }

  let id_role;
  if (role === 'admin') {
    id_role = 1;
  } else if (role === 'utilisateur') {
    id_role = 2;
  } else {
    return res.status(400).json({ message: 'Rôle invalide. Utilisez "admin" ou "utilisateur".' });
  }

  try {
    
    const hashedPassword = await bcrypt.hash(password, 10);

  
    const newUtilisateur = await Utilisateur.create({
      nom,
      prenom,
      password: hashedPassword,
      id_role,
    });

    
    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      utilisateur: {
        id_utilisateur: newUtilisateur.id_utilisateur,
        nom: newUtilisateur.nom,
        prenom: newUtilisateur.prenom,
        role: newUtilisateur.id_role === 1 ? 'admin' : 'utilisateur',
      },
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur controller:', error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la création de l\'utilisateur' });
  }
};
