const jwt = require('jsonwebtoken');

const verifyAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(403).json({ message: "Accès refusé. Aucun token fourni." });

    const decoded = jwt.verify(token, 'secret'); 
    if (decoded.id_role !== 1) {
      return res.status(403).json({ message: "Accès refusé. Vous n'êtes pas administrateur." });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalide." });
  }
};

module.exports = verifyAdmin;
