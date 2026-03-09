import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  if (!JWT_SECRET) {
    return res.status(500).json({ error: "JWT secret is not configured" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    console.log(decoded.id);
    req.headers["x-user-id"] = decoded.id;

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
