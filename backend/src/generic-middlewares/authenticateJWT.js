import jwt from "jsonwebtoken";
import { config } from "../config/env/envConfig.js";
import {
  AuthenticationError,
  UnauthorizedError,
  ErrorHandler
} from "../utils/errors.js";

const secretKey = config.jwtSecret;

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return ErrorHandler.formatResponse(res, new AuthenticationError("Unauthorized: No token provided."));
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
        return ErrorHandler.formatResponse(res, new UnauthorizedError("Forbidden: Invalid or expired token."));
    }

    req.user = user;
    next();
  });
};
