import User from "../models/userSchema.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  const { email, password, name, profilePicture } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(404).json({ message: "User already exist." });

    const user = await User.create({
      email,
      password,
      name,
      profilePicture,
    });
    const token = jwt.sign(
      {
        email: user.email,
        id: user._id,
        name: user.name,
        profilePicture: user.profilePicture,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "30d",
      }
    );
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
