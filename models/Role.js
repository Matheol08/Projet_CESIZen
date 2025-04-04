const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../server.js');

const Role = sequelize.define('Role', {
  id_role: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom_role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Role;
