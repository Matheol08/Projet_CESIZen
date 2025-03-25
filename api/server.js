const express = require("express");
const cors = require("cors");
const { Sequelize } = require("sequelize");
const authRoutes = require("./routes/authRoutes");
const createUserRoutes = require("./routes/createUserRoutes");
require("dotenv").config({ path: '.env' });
console.log("Clé JWT chargée :", process.env.JWT_SECRET);


const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors());

const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT || "mysql",
  host: process.env.DB_HOST ,
  username: process.env.DB_USER ,
  password: process.env.DB_PASSWORD ,
  database: process.env.DB_NAME ,
  logging: false,
});

sequelize.authenticate()
  .then(() => console.log("✅ Connexion MySQL réussie"))
  .catch(err => {
    console.error("❌ Erreur de connexion MySQL:", err);
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/auth", createUserRoutes);

app.listen(port, () => console.log(`🚀 Serveur démarré sur le port ${port}`));

module.exports = sequelize;
