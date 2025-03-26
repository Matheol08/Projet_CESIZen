const jwt = require('jsonwebtoken');

exports.getUserStatus = (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1]; 
  
  if (!token) {
    return res.status(401).json({ message: "Token manquant" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token invalide" });
    }
    
    const { id_role } = decoded;
    res.json({ id_role });
  });s
};
