import { UniqueConstraintError } from "sequelize";
import { User } from "../model/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../../../../config/env/envConfig.js";
import {
  ValidationError,
  NotFoundError,
  AuthenticationError,
  DuplicateFieldError,
  ErrorHandler
} from "../../../../utils/errors.js";

class UserController {
  async getUsers(req, res) {
    try {
      const users = await User.findAll();

      if (users.length === 0) {
        return ErrorHandler.formatReposonse(res, new NotFoundError("No users registered."));
      }

      const usersWithoutPasswords = users.map((user) => {
        const { password, ...userWithoutPassword } = user.get();
        return userWithoutPassword;
      });

      return res.status(200).json(usersWithoutPasswords);
    } catch (error) {
      ErrorHandler.formatReposonse(res, error);
    }
  }

  async getUserById(req, res) {
    try {
      const userWithoutPassword = { ...req.user.get(), password: undefined };
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      ErrorHandler.formatReposonse(res, error);
    }
  }

  async createUser(req, res) {
    try {
      const hashedPassword = bcrypt.hashSync(req.body.password, 10);

      const newUser = await User.create({
        ...req.body,
        password: hashedPassword,
      });

      const userWithoutPassword = { ...newUser.get(), password: undefined };

      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        const duplicateField = error.errors[0].path;
        return ErrorHandler.formatReposonse(res, new DuplicateFieldError(duplicateField));
      }
      ErrorHandler.formatReposonse(res, error);
    }
  }

  async updateUser(req, res) {
    try {
      const [updated] = await User.update(req.body, {
        where: { id: req.params.id },
      });

      if (updated) {
        return res.status(200).send({ message: "User successfully updated." });
      }

      return ErrorHandler.formatReposonse(res, new ValidationError("Failed to update user."));
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        return ErrorHandler.formatReposonse(res, new DuplicateFieldError("CPF"));
      }
      ErrorHandler.formatReposonse(res, error);
    }
  }

  async deleteUser(req, res) {
    try {
      const deleted = await User.destroy({
        where: { id: req.params.id },
      });

      if (deleted) {
        return res.status(200).send({ message: "User successfully deleted." });
      }

      return ErrorHandler.formatReposonse(res, new NotFoundError("User not found."));
    } catch (error) {
      ErrorHandler.formatReposonse(res, error);
    }
  }

  async loginUser(req, res) {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({
        where: { username },
        attributes: ["id", "username", "password"],
      });

      if (!user) {
        return ErrorHandler.formatReposonse(res, new AuthenticationError("Invalid username or password."));
      }

      if (!user.get("password")) {
        return ErrorHandler.formatReposonse(res, new AuthenticationError("Password not found for the user."));
      }

      const isPasswordValid = bcrypt.compareSync(
        password,
        user.get("password"),
      );

      if (!isPasswordValid) {
        return ErrorHandler.formatReposonse(res, new AuthenticationError("Invalid username or password."));
      }

      const token = jwt.sign(
        { id: user.get("id"), username: user.get("username") },
        config.jwtSecret,
        { expiresIn: "1h" },
      );

      return res.status(200).json({ token });
    } catch (error) {
      ErrorHandler.formatReposonse(res, error);
    }
  }
}

const userController = new UserController();
export { userController };
