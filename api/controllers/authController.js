const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const utilisateur = require('../models/utilisateur');

exports.login = async (req, res) => {
  const { prenom, nom, password } = req.body;

  try {
    // Recherche l'utilisateur dans la base de données par prénom et nom
    const user = await utilisateur.findOne({
      where: { prenom, nom }
    });

    if (!user) {
      return res.status(401).json({ message: "Nom ou prénom incorrect" });
    }

    // Comparaison du mot de passe haché avec celui fourni
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    // Génération du token JWT
    const token = jwt.sign(
      {
        id: user.id_utilisateur,       // ID de l'utilisateur
        prenom: user.prenom,           // Prénom de l'utilisateur
        nom: user.nom,                 // Nom de l'utilisateur
        id_role: user.id_role,         // Récupère l'ID du rôle de l'utilisateur
      },
      process.env.JWT_SECRET,          // Clé secrète pour signer le token
      { expiresIn: "1h" }              // Durée d'expiration du token
    );

    // Réponse contenant le token
    res.json({ message: "Connexion réussie", token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};
