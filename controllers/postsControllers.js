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
