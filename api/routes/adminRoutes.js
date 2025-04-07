const express = require('express');
const router = express.Router();
const verifyAdmin = require('../authMiddleware');

router.get('/admin-data', verifyAdmin, (req, res) => {
  res.json({ message: "Bienvenue dans la section admin !" });
});

module.exports = router;
