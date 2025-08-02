const jwt = require("jsonwebtoken");
const User = require("../models/User"); // You forgot this import earlier
require("dotenv").config();

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id); // ✅ Load user from DB

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // ✅ Assign full user
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = { protect };
