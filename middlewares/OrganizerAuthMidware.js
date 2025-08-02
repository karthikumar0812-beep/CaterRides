const jwt = require("jsonwebtoken");
const Organizer = require("../models/Organizer");

const protectOrganizer = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.organizer = await Organizer.findById(decoded.id).select("-password");

    if (!req.organizer) {
      return res.status(401).json({ message: "Organizer not found" });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = protectOrganizer;
