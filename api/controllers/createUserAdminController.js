const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');
const Utilisateur = require('../models/utilisateur');
const jwt = require('jsonwebtoken');

exports.createUtilisateur = async (req, res) => {
  const { nom, prenom, email, mot_de_passe, role } = req.body;

  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token manquant' });
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide' });
  }

  if (!req.user || req.user.id_role !== 1) {
    return res.status(403).json({ message: 'Accès refusé. Seuls les admins peuvent créer un utilisateur.' });
  }

  if (!nom || !prenom || !email || !mot_de_passe || !role) {
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
  
    const existingUser = await Utilisateur.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà' });
    }

    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    const newUtilisateur = await Utilisateur.create({
      nom,
      prenom,
      email,
      mot_de_passe: hashedPassword,
      id_role,
    });

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      utilisateur: {
        id_utilisateur: newUtilisateur.id_utilisateur,
        nom: newUtilisateur.nom,
        prenom: newUtilisateur.prenom,
        email: newUtilisateur.email,
        role: newUtilisateur.id_role === 1 ? 'admin' : 'utilisateur',
      },
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la création de l\'utilisateur' });
  }
};
