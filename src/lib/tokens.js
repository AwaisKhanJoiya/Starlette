import jwt from "jsonwebtoken";
import crypto from "crypto";

// JWT secret should be in an environment variable
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const generateResetToken = () => {
  // Generate a random reset token
  return crypto.randomBytes(32).toString("hex");
};

export const extractTokenFromHeader = (req) => {
  // Debug headers

  // Use get() method to access headers from the Headers object
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  // Extract the token from Bearer token
  return authHeader.split(" ")[1];
};
