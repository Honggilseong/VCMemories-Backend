import User from "../models/userSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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

    const userData = {
      email: user.email,
      name: user.name,
      profilePicture: user.profilePicture,
      token,
    };

    res.status(200).json({ user: userData });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(404).json({ message: "User doesn't exist." });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      "test",
      { expiresIn: "30d" }
    );

    const userData = {
      email: existingUser.email,
      name: existingUser.name,
      profilePicture: existingUser.profilePicture,
      token,
    };

    res.status(200).json({ user: userData });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
