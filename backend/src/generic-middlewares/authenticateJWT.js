import jwt from "jsonwebtoken";
import { config } from "../config/env/envConfig.js";

const secretKey = config.jwtSecret;

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Unauthorized: No token provided." });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Forbidden: Invalid or expired token." });
    }

    req.user = user;
    next();
  });
};
