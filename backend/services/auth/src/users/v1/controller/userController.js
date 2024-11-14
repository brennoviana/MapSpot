import bcrypt from "bcryptjs";
import { UniqueConstraintError } from "sequelize";
import jwt from "jsonwebtoken";
import fs from 'fs';

import { config } from "../../../config/env/envConfig.js";
import { User } from "../model/userModel.js";

import { ResponseFormatter } from "../../../utils/sucess.js";
import {
  ValidationError,
  NotFoundError,
  AuthenticationError,
  DuplicateFieldError,
  ErrorHandler
} from "../../../utils/errors.js";

class UserController {
  async getUsers(req, res) {
    try {
      const users = await User.findAll();

      if (users.length === 0) {
        return ErrorHandler.formatResponse(res, new NotFoundError("No users registered."));
      }

      const usersWithoutPasswords = users.map((user) => {
        const { password, ...userWithoutPassword } = user.get();
        return userWithoutPassword;
      });

      return ResponseFormatter.send(res, usersWithoutPasswords, 'Users found successfully.');
    } catch (error) {
      ErrorHandler.formatResponse(res, error);
    }
  }

  async getUserById(req, res) {
    try {
      const userWithoutPassword = { ...req.user.get(), password: undefined };
      return ResponseFormatter.send(res, userWithoutPassword, "User retrieved successfully.");
    } catch (error) {
      ErrorHandler.formatResponse(res, error);
    }
  }

  async createUser(req, res) {
    try {
      const hashedPassword = bcrypt.hashSync(req.body.password, 10);
      const profileImagePath = req.file ? req.file.filename : null;

      const newUser = await User.create({
        ...req.body,
        password: hashedPassword,
        profileImage: profileImagePath,
      });
  
      const userWithoutPassword = { ...newUser.get(), password: undefined };

      return ResponseFormatter.send(res, userWithoutPassword, "User created successfully.", 201);
    } catch (error) {
      
      if (req.file && req.file.path) {
        fs.unlink(req.file.path, (unlinkError) => {
          if (unlinkError) console.error("Error at deleting file:", unlinkError);
        });
      }

      if (error instanceof UniqueConstraintError) {
        const duplicateField = error.errors[0].path;
        return ErrorHandler.formatResponse(res, new DuplicateFieldError(duplicateField));
      }
      ErrorHandler.formatResponse(res, error);
    }
  }

  async updateUser(req, res) {
    try {
      const [updated] = await User.update(req.body, {
        where: { id: req.params.id },
      });

      if (updated) {
        return ResponseFormatter.send(res, null, "User successfully updated.");
      }

      return ErrorHandler.formatResponse(res, new ValidationError("Failed to update user."));
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        return ErrorHandler.formatResponse(res, new DuplicateFieldError("CPF"));
      }
      ErrorHandler.formatResponse(res, error);
    }
  }

  async deleteUser(req, res) {
    try {
      const deleted = await User.destroy({
        where: { id: req.params.id },
      });

      if (deleted) {
        return ResponseFormatter.send(res, null, "User successfully deleted.");
      }

    } catch (error) {
      ErrorHandler.formatResponse(res, error);
    }
  }

  async loginUser(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({
        where: { email },
        attributes: ["id", "email", "password"],
      });

      if (!user) {
        return ErrorHandler.formatResponse(res, new AuthenticationError("Invalid email or password."));
      }

      if (!user.get("password")) {
        return ErrorHandler.formatResponse(res, new AuthenticationError("Password not found for the user."));
      }

      const isPasswordValid = bcrypt.compareSync(
        password,
        user.get("password"),
      );

      if (!isPasswordValid) {
        return ErrorHandler.formatResponse(res, new AuthenticationError("Invalid email or password."));
      }

      const token = jwt.sign(
        { id: user.get("id"), username: user.get("email") },
        config.jwtSecret,
        { expiresIn: "1h" },
      );

      return ResponseFormatter.send(res, {id: user.get("id"), token }, "Login successful.");
    } catch (error) {
      ErrorHandler.formatResponse(res, error);
    }
  }
}

const userController = new UserController();
export { userController };
