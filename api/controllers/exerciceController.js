const Exercice = require('../models/exercice');

exports.getExercices = async (req, res) => {
  try {
    const exercices = await Exercice.findAll();

    const result = exercices.map(exo => ({
      nom: exo.nom_exercice,
      phases: [
        { name: 'respiration', duration: Number(exo.temps_respiration) || 0 },
        { name: 'apnée', duration: Number(exo.temps_apnee) || 0 },
        { name: 'expiration', duration: Number(exo.temps_expiration) || 0 }
      ]
    }));

    res.json(result);
  } catch (error) {
    console.error("Erreur lors de la récupération des exercices :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
