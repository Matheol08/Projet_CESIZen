const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('mysql://root:root@localhost:3306/cesizen'); 

const utilisateur = sequelize.define('utilisateur', {
  id_utilisateur: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id_role: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'utilisateur',
  timestamps: false
});

// Synchronisation du modèle avec la base de données
sequelize.sync()
  .then(() => {
    console.log('Table utilisateur synchronisée');
  })
  .catch((err) => {
    console.error('Erreur de synchronisation', err);
  });

module.exports = utilisateur;
