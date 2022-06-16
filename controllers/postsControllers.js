import mongoose from "mongoose";
import Post from "../models/postSchema.js";

export const createPost = async (req, res) => {
  const post = req.body;
  const newPost = new Post({ ...post, createAt: new Date().toISOString() });
  try {
    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const postMessages = await Post.find();

    res.status(200).json(postMessages);
  } catch (error) {
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

    await Post.findByIdAndRemove(id);

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
  }
};
