const jwt = require('jsonwebtoken')
const prisma = require('../config/prisma')

exports.authCheck = async (req, res, next) => {
  try {
    const headerToken = req.headers.authorization;
    if (!headerToken) {
      return res.status(401).json({ message: "No Token, Authorization Denied" });
    }
    const token = headerToken.split(" ")[1];
    if (!token || token === "undefined" || token === "null") {
      return res.status(401).json({ message: "Invalid Token Format" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    
    req.user = decoded;
    next();
  } catch (err) {
    console.log("Auth Check Error:", err.message);
    return res.status(401).json({ message: "Token is not valid" }); 
  }
};
exports.adminCheck = async (req, res, next) => {
    try {
        if (!req.user || !req.user.email) {
            return res.status(401).json({ message: 'Unauthorized: No user email in token' });
        }
        const { email } = req.user;
        const adminUser = await prisma.user.findFirst({
            where: { email: email }
        });
        if (!adminUser || adminUser.role !== 'admin') {
            return res.status(403).json({ message: 'Access Denied: Admin Only' });
        }

        next();
    } catch (err) {
        console.log("Admin Check Error Detail:", err.message); 
        return res.status(403).json({ message: 'Forbidden: Admin access verification failed' });
    }
};