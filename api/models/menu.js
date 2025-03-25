const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../server.js');

const menu = sequelize.define('menu', {
  id_menu: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contenue:{
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = menu;
