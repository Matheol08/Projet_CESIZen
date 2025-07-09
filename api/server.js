const express = require("express");
const cors = require("cors");
const { Sequelize } = require("sequelize");
const authRoutes = require("./routes/authRoutes");
const createUserRoutes = require("./routes/createUserRoutes");
const menuRoute = require("./routes/menuRoute");
const listeUtilisateurRoutes = require('./routes/listeUtilisateurRoutes');
const adminRoutes = require('./routes/adminRoutes');
const deleteUserAdminRoutes = require('./routes/deleteUserAdminRoutes'); 
const menuRoutes = require('./routes/updateMenuRoutes');
const createUserAdminRoutes = require('./routes/createUserAdminRoutes'); 
const updatePasswordRoutes = require('./routes/updatePasswordRoutes');
const exerciceRoutes = require('./routes/exerciceRoutes');

const port = process.env.PORT || 3000;
const app = express();

require("dotenv").config({ path: '.env' });

app.use(express.json());
app.use(cors());

const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT || "mysql",
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false,
});

const connectWithRetry = async (retries = 10, delay = 3000) => {
  while (retries > 0) {
    try {
      await sequelize.authenticate();
      console.log("✅ Connexion MySQL réussiee");

      app.listen(port, () => {
        console.log(`🚀 Serveur démarré sur le port ${port}`);
      });

      return;
    } catch (err) {
      console.error(`❌ Connexion MySQL échouée (${11 - retries}/10): ${err.message}`);
      retries--;
      if (retries === 0) {
        console.error("💥 Échec de connexion après plusieurs tentatives. Arrêt du processus.");
        process.exit(1);
      }
      await new Promise(res => setTimeout(res, delay));
    }
  }
};

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/auth", createUserRoutes);
app.use('/api', menuRoute);
app.use('/api/updatePassword', updatePasswordRoutes);
app.use('/api', listeUtilisateurRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/deleteUser', deleteUserAdminRoutes); 
app.use('/api', menuRoutes);
app.use('/api', createUserAdminRoutes);
app.use('/api/exercice', exerciceRoutes);

connectWithRetry();

module.exports = sequelize;
