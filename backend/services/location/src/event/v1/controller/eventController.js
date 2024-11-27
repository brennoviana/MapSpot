import bcrypt from "bcryptjs";
import { UniqueConstraintError } from "sequelize";
import fs from 'fs';
import { User } from "../model/eventModel.js";
import { ResponseFormatter } from "../../../utils/sucess.js";
import {
  ValidationError,
  NotFoundError,
  AuthenticationError,
  DuplicateFieldError,
  ErrorHandler
} from "../../../utils/errors.js";

class EventController {
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
}

const eventController = new EventController();
export { eventController };
