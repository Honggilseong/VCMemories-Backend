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
      _id: user._id,
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
      process.env.SECRET_KEY,
      { expiresIn: "30d" }
    );

    const userData = {
      _id: existingUser._id,
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

export const getUserInfo = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User doesn't exist." });
    const {
      _id,
      email,
      name,
      profilePicture,
      userPosts,
      followers,
      following,
    } = user;
    const userData = {
      _id,
      email,
      name,
      profilePicture,
      userPosts,
      followers,
      following,
    };

    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getSearchingUser = async (req, res) => {
  const { username } = req.params;
  try {
    const userData = await User.findOne({ name: username }).select("-password");

    if (!userData)
      return res.status(404).json({ message: "User doesn't exist." });

    res.status(200).json(userData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
