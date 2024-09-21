import { UniqueConstraintError } from "sequelize";
import { User } from "../model/userModel.js";
import { UseFulFunctions } from "../../../../useFulFunctions/UseFulFunctions.js";
import { config } from "../../../../config/env/envConfig.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class UserController {
  async getUsers(req, res) {
    try {
      const users = await User.findAll();

      if (users.length === 0) {
        return res.status(200).send({ message: "No users registered." });
      }

      const usersWithoutPasswords = users.map((user) => {
        const { password, ...userWithoutPassword } = user.get();
        return userWithoutPassword;
      });

      return res.status(200).json(usersWithoutPasswords);
    } catch (error) {
      return res
        .status(500)
        .send({ message: UseFulFunctions.getErrorMessage(error) });
    }
  }

  async getUserById(req, res) {
    try {
      const userWithoutPassword = { ...req.user.get(), password: undefined };

      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      return res
        .status(500)
        .send({ message: UseFulFunctions.getErrorMessage(error) });
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
        if (duplicateField === "cpf") {
          return res.status(409).send({ message: "CPF already exists." });
        }
        if (duplicateField === "username") {
          return res.status(409).send({ message: "Username already exists." });
        }
      }
      return res
        .status(500)
        .send({ message: UseFulFunctions.getErrorMessage(error) });
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

      return res.status(400).send({ message: "Failed to update user." });
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        return res.status(409).send({ message: "CPF already exists." });
      }
      return res
        .status(500)
        .send({ message: UseFulFunctions.getErrorMessage(error) });
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

      return res.status(400).send({ message: "Failed to delete user." });
    } catch (error) {
      return res
        .status(500)
        .send({ message: UseFulFunctions.getErrorMessage(error) });
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
        return res
          .status(401)
          .send({ message: "Invalid username or password" });
      }

      if (!user.get("password")) {
        return res
          .status(500)
          .send({ message: "Password not found for the user" });
      }

      const isPasswordValid = bcrypt.compareSync(
        password,
        user.get("password"),
      );

      if (!isPasswordValid) {
        return res
          .status(401)
          .send({ message: "Invalid username or password" });
      }

      const token = jwt.sign(
        { id: user.get("id"), username: user.get("username") },
        config.jwtSecret,
        { expiresIn: "1h" },
      );

      return res.status(200).json({ token });
    } catch (error) {
      return res
        .status(500)
        .send({ message: "An error occurred during login." });
    }
  }
}

const userController = new UserController();
export { userController };
