const bcrypt = require('bcrypt');
const utilisateur = require('../models/utilisateur');

exports.createUser = async (req, res) => {
  const { prenom, nom, email, mot_de_passe, id_role } = req.body;

  const userRole = id_role || 2;

  console.log(req.body);

  if (!prenom || !nom || !email || !mot_de_passe) {
    return res.status(400).json({ message: 'Tous les champs sont requiis (prénom, nom, email, mot de passe)' });
  }

  try {
    // Vérifie si un utilisateur avec le même email existe déjà
    const existingUser = await utilisateur.findOne({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà' });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    // Création de l'utilisateur
    const user = await utilisateur.create({
      prenom,
      nom,
      email,
      mot_de_passe: hashedPassword,
      id_role: userRole
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur' });
  }
};
