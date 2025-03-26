const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('mysql://root:root@localhost:3306/cesizen'); 

const role = sequelize.define('Role', {
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

module.exports = role;
