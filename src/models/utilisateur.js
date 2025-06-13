const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('mysql://root:root@mysql:3306/cesizen');

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
   mot_de_passe: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id_role: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'utilisateur',
  timestamps: false
});

sequelize.sync()
  .then(() => {
    console.log('Table utilisateur synchronisée');
  })
  .catch((err) => {
    console.error('Erreur de synchronisation', err);
  });

module.exports = utilisateur;
