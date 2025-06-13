const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('mysql://root:root@mysql:3306/cesizen');


const Exercice = sequelize.define('exercice', {
  id_exercice: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom_exercice: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  temps_expiration: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  temps_apnee: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  temps_respiration: { 
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'exercice',
  timestamps: false,
});

module.exports = Exercice;
