const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const utilisateur = require('../models/utilisateur');

exports.login = async (req, res) => {
  const { email, mot_de_passe } = req.body;

  try {
    const user = await utilisateur.findOne({
      where: { email }
      
    });

    if (!user) {
      return res.status(401).json({ message: "Email incorrect" });
    }

    const passwordMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign(
      {
        id: user.id_utilisateur,
        prenom: user.prenom,
        nom: user.nom,
        id_role: user.id_role,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "45min" }
    );

    // Réponse avec le token
    res.json({ message: "Connexion réussie", token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};
