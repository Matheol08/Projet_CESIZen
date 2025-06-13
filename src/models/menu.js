const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('mysql://root:root@mysql:3306/cesizen');

const menu = sequelize.define('Menu', {
  id_menu: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contenu: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'menu',
  timestamps: false, // Si ta table ne possède pas de timestamps
});

module.exports = menu;
