import User from "../models/userSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

export const signup = async (req, res) => {
  const { email, password, name, profilePicture } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    const existingUserByName = await User.findOne({ name });
    if (existingUser)
      return res.status(404).json({ message: "Your email already exists." });
    if (existingUserByName)
      return res.status(404).json({ message: "Your name already exists." });

    const user = await User.create({
      email,
      password,
      name: name.toLowerCase(),
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
        expiresIn: "9999d",
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
    const user = await User.findById(id)
      .populate({
        path: "posts",
        options: { sort: { createdAt: -1 } },
      })
      .select("-password");
    if (!user) return res.status(404).json({ message: "User doesn't exist." });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getSearchingUser = async (req, res) => {
  const { username } = req.params;
  try {
    const userData = await User.findOne({ name: username })
      .populate({ path: "posts", options: { sort: { createdAt: -1 } } })
      .select("-password -notifications");

    if (!userData)
      return res.status(404).json({ message: "User doesn't exist." });
    res.status(200).json(userData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({}).select("-password");

    res.status(200).json(allUsers);
  } catch (error) {
    res.status(401).json({ message: "Something went wrong " });
  }
};

export const followUser = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  if (id === userId) return res.status(405).send("same user");
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send("no user with the id");

    const user = await User.findById(id).select("-userPosts -password");
    const reqUser = await User.findById(userId).select("-userPosts -password");

    const index = user.followers.findIndex((id) => id === userId);
    const reqIndex = reqUser.following.findIndex(
      (followingUser) => followingUser === id
    );

    if (index === -1) {
      user.followers.push(userId);
    } else {
      user.followers = user.followers.filter((id) => id !== userId);
    }
    const updatedUser = await User.findByIdAndUpdate(id, user, {
      new: true,
    });

    if (reqIndex === -1) {
      reqUser.following.push(id);
    } else {
      reqUser.following = reqUser.following.filter(
        (followingUser) => followingUser !== id
      );
    }
    await User.findByIdAndUpdate(userId, reqUser, { new: true });
    res.json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Something went wrong" });
  }
};
export const acceptFollowRequest = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send("no user with the id");

    const user = await User.findById(id).select("-userPosts -password");
    const reqUser = await User.findById(userId).select("-userPosts -password");
    user.followers.push(userId);
    user.followRequests = user.followRequests.filter(
      (request) => request.userId !== userId
    );

    reqUser.following.push(id);

    await User.findByIdAndUpdate(userId, reqUser, { new: true });
    const updatedUser = await User.findByIdAndUpdate(id, user, {
      new: true,
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Something went wrong" });
  }
};
export const deleteFollowRequest = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send("no user with the id");

    const user = await User.findById(id).select("-userPosts -password");
    user.followRequests = user.followRequests.filter(
      (request) => request.userId !== userId
    );
    const updatedUser = await User.findByIdAndUpdate(id, user, {
      new: true,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Something went wrong" });
  }
};
export const uploadProfileImage = async (req, res) => {
  const { id, uploadImage } = req.body;

  try {
    const user = await User.findById(id);

    user.profilePicture = uploadImage;

    const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(401).json({ message: "Something went wrong " });
  }
};

export const sendNotification = async (req, res) => {
  const { id } = req.params;
  const { sender, notificationType, image, postId } = req.body;
  const notification = {
    _id: new mongoose.Types.ObjectId(),
    sender,
    notificationType,
    image,
    postId,
    read: false,
  };

  try {
    const user = await User.findById(id);
    user.notifications.unshift(notification);

    const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ message: "Something went wrong" });
  }
};

export const readNotification = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);

    user.notifications = user.notifications.map((notification) => {
      return { ...notification, read: true };
    });

    const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ message: "Something went wrong" });
  }
};

export const deleteNotifications = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);

    user.notifications = [];

    const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ message: "Something went wrong" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await User.findByIdAndDelete(id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ message: "Something went wrong" });
  }
};

export const sendFollowRequest = async (req, res) => {
  const { id } = req.params;
  const { senderData } = req.body;
  const dataWithId = {
    _id: new mongoose.Types.ObjectId(),
    ...senderData,
  };
  try {
    const requestUser = await User.findById(id);
    const findIndex = requestUser.followRequests.findIndex(
      (request) => request.userId === senderData.userId
    );
    if (findIndex !== -1)
      return res.status(400).json({ message: "Already requested" });

    requestUser.followRequests.push(dataWithId);

    await User.findByIdAndUpdate(id, requestUser, { new: true });

    res.json({ message: "Success" });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Something went wrong" });
  }
};

export const switchAccountState = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    user.isPrivate = !user.isPrivate;
    const updatedUser = await User.findByIdAndUpdate(id, user, {
      new: true,
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Something went wrong" });
  }
};

export const deleteAllFollowRequests = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    user.followRequests = [];
    const updatedUser = await User.findByIdAndUpdate(id, user, {
      new: true,
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Something went wrong" });
  }
};

export const updateUserBio = async (req, res) => {
  const { id } = req.params;
  const { bio } = req.body;
  try {
    const user = await User.findById(id);
    user.bio = bio;

    const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Something went wrong" });
  }
};

export const getFollowUsersList = async (req, res) => {
  const { followList } = req.body;
  try {
    if (followList.length === 0) return res.status(204).json([]);
    const followUsersList = await User.find({
      _id: { $in: followList },
    }).select("name profilePicture");
    res.status(200).json(followUsersList);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
