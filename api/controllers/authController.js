const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const utilisateur = require('../models/utilisateur');

exports.login = async (req, res) => {
  const { prenom, nom, password } = req.body;

  try {
    const user = await utilisateur.findOne({
      where: { prenom, nom }
    });

    if (!user) {
      return res.status(401).json({ message: "Nom ou prénom incorrect" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign(
      {
        id: user.id_utilisateur,       
        prenom: user.prenom,           
        nom: user.nom,                 
        id_role: user.id_role,         
      },
      process.env.JWT_SECRET,          
      { expiresIn: "1h" }             
    );

    res.json({ message: "Connexion réussie", token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};
