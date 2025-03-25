const bcrypt = require('bcrypt');
const utilisateur = require('../models/utilisateur');

exports.createUser = async (req, res) => {
  const { prenom, nom, password, id_role } = req.body;

  const userRole = id_role || 2; 

  console.log(req.body);

  if (!prenom || !nom || !password) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  try {
    const existingUser = await utilisateur.findOne({
      where: {
        prenom: prenom,
        nom: nom
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Un utilisateur avec ce prénom ou ce nom existe déjà' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await utilisateur.create({
      prenom,
      nom,
      password: hashedPassword, 
      id_role: userRole
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur' });
  }
};
