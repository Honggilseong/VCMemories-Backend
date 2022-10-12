import mongoose from "mongoose";
import Post from "../models/postSchema.js";
import User from "../models/userSchema.js";
import cloudinary from "../util/cloudinary.js";

export const createPost = async (req, res) => {
  const { postData } = req.body;
  let images = [];
  try {
    for (let i = 0; i < postData.images.length; i++) {
      let path = postData.images[i];

      let result = await cloudinary.v2.uploader.upload(path, {
        transformation: [{ width: 960, height: 540, quality: "auto" }],
      });
      images.push(result.url);
    }
    const newPost = new Post({ ...postData, createdAt: new Date(), images });
    await newPost.save();
    const user = await User.findById(postData.userId);
    user.posts.push(newPost._id);
    await user.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPosts = async (req, res) => {
  const followingUsers = req.body;
  try {
    if (followingUsers.length === 0) return res.status(204).json([]);
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
    res.status(200).json(followingPosts);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
export const getHashtagPosts = async (req, res) => {
  const { hashtag } = req.params;
  try {
    const hashtagPosts = await Post.find({
      message: { $regex: `#${hashtag}(?![a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣])` },
    })
      .sort({ createdAt: -1 })
      .limit(10);
    if (!hashtagPosts) {
      res.status(204).json([]);
    } else {
      res.status(200).json(hashtagPosts);
    }
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
    await cloudinary.v2.uploader.destroy(deletePostInfo.picture);
    if (deletePostInfo.userId !== userId)
      return res.status(404).send("a wrong user tried to delete this post");

    const user = await User.findById(userId);
    await Post.findByIdAndRemove(id);

    user.posts = user.posts.filter(
      (post) => post._id.toString() !== id.toString()
    );
    await User.findByIdAndUpdate(userId, user, { new: true });

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Something went wrong" });
  }
};

export const likePost = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send("no post with the id");

    const post = await Post.findById(id);
    const index = post.likes.findIndex((id) => id === userId);
    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes = post.likes.filter((id) => id !== userId);
    }
    const updatedPost = await Post.findByIdAndUpdate(id, post, {
      new: true,
    });
    res.status(201).json(updatedPost);
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Something went wrong" });
  }
};

export const leaveComment = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  const commentWithId = {
    _id: new mongoose.Types.ObjectId(),
    ...comment,
  };
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send("no post with the id");
    }
    const post = await Post.findById(id);

    post.comments.push(commentWithId);

    const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true });

    res.status(201).json(updatedPost);
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Something went wrong" });
  }
};
export const deleteUserComment = async (req, res) => {
  const { id } = req.params;
  const { commentId } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send("no post with the id");
    }
    const post = await Post.findById(id);

    post.comments = post.comments.filter(
      (comment) => comment._id.toString() !== commentId
    );

    const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true });

    res.status(201).json(updatedPost);
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Something went wrong" });
  }
};
export const editUserPost = async (req, res) => {
  const { id } = req.params;
  const { title, message } = req.body;
  try {
    const post = await Post.findById(id);

    post.title = title;
    post.message = message;
    post.isEdit = true;

    const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true });

    res.status(201).json(updatedPost);
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Something went wrong" });
  }
};

export const mentionUsersNotification = async (req, res) => {
  const { id } = req.params;
  const { mentionUsers, sender, notificationType, image } = req.body;
  console.log(mentionUsers, sender, notificationType, image);
  try {
    if (mentionUsers.length === 0)
      return res.status(204).json({ message: "no mention users" });
    mentionUsers.forEach(async (userId) => {
      await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            notifications: {
              $each: [
                {
                  _id: new mongoose.Types.ObjectId(),
                  sender,
                  notificationType,
                  image,
                  postId: id,
                  read: false,
                },
              ],
              $position: 0,
            },
          },
        },
        { new: true }
      );
    });
    res.status(204).json({ message: "sent notifications" });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Something went wrong" });
  }
};

export const getNotificationsPost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);

    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Something went wrong" });
  }
};
