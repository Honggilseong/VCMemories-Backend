import mongoose from "mongoose";
import Post from "../models/postSchema.js";
import User from "../models/userSchema.js";

export const createPost = async (req, res) => {
  const post = req.body;
  const newPost = new Post({ ...post, createdAt: new Date() });
  try {
    await newPost.save();
    const user = await User.findById(post.userId);
    user.userPosts.unshift(newPost);
    await user.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const getPosts = async (req, res) => {
  const followingUsers = req.body;
  console.log(followingUsers);
  try {
    if (followingUsers.length === 0) return [];
    const followingPosts = await Post.aggregate([
      {
        $match: {
          userId: { $in: followingUsers },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $limit: 10,
      },
    ]);
    console.log(followingPosts);
    res.status(200).json(followingPosts);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No post with that id");
  try {
    const deletePostInfo = await Post.findById(id);

    if (deletePostInfo.userId !== userId)
      return res.status(404).send("a wrong user tried to delete this post");

    const user = await User.findById(userId);
    await Post.findByIdAndRemove(id);

    user.userPosts = user.userPosts.filter((post) => post._id !== id);
    await User.findByIdAndUpdate(userId, user, { new: true });

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
  }
};

export const likePost = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send("no post with the id");

    const post = await Post.findById(id);
    const user = await User.findById(post.userId);
    const userPostIndex = user.userPosts.findIndex(
      (userPost) => userPost._id === id
    );
    const index = post.likes.findIndex((id) => id === userId);

    if (index === -1) {
      post.likes.push(userId);
      user.userPosts[userPostIndex].likes.push(userId);
    } else {
      post.likes = post.likes.filter((id) => id !== userId);
      user.userPosts[userPostIndex].likes.filter((id) => id !== userId);
    }
    await User.findByIdAndUpdate(post.userId, user, { new: true });
    const updatedPost = await Post.findByIdAndUpdate(id, post, {
      new: true,
    });
    res.json(updatedPost);
  } catch (err) {
    console.log(err);
  }
};

export const leaveComment = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send("no post with the id");
    }
    const post = await Post.findById(id);
    const user = await User.findById(post.userId);
    post.comments.push(comment);
    const userPostIndex = user.userPosts.findIndex(
      (userPost) => userPost._id === id
    );
    user.userPosts[userPostIndex].comments.push(comment);
    const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true });
    await User.findByIdAndUpdate(post.userId, user, { new: true });
    res.status(201).json(updatedPost);
  } catch (error) {
    console.log(error);
  }
};
