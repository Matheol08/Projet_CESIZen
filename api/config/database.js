const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('CESIZen', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
});

module.exports = sequelize;
