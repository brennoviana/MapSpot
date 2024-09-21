import { User } from "../model/userModel.js";

async function validateUserExists(req, res, next) {
  try {
    const userId = req.body.userId || req.params.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    req.user = user;

    next();
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error occurred while verifying the user." });
  }
}

export { validateUserExists };
