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


const port = process.env.PORT || 5000;
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

sequelize.authenticate()
  .then(() => console.log("✅ Connexion MySQL réussie"))
  .catch(err => {
    console.error("❌ Erreur de connexion MySQL:", err);
  });

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


app.listen(port, () => console.log(`🚀 Serveur démarré sur le port ${port}`));

module.exports = sequelize;


