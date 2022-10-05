import mongoose from "mongoose";
import BoardPost from "../models/boardPostSchema.js";
import User from "../models/userSchema.js";
import cloudinary from "../util/cloudinary.js";

export const getAllBoardPosts = async (req, res) => {
  try {
    const boardPosts = await BoardPost.find({}).sort({ createdAt: -1 });
    res.status(200).json(boardPosts);
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Something went wrong" });
  }
};

export const createBoardPost = async (req, res) => {
  const { boardPost } = req.body;
  const saveBoardPost = new BoardPost({
    ...boardPost,
  });
  console.log(saveBoardPost);
  try {
    await saveBoardPost.save();
    const userInfo = await User.findById(boardPost.userId);

    userInfo.boardPosts.push(saveBoardPost._id);

    await User.findByIdAndUpdate(boardPost.userId, userInfo, { new: true });

    res.status(200).json("Success");
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Something went wrong" });
  }
};

export const deleteBoardPost = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const boardPost = await BoardPost.findById(id);
    if (boardPost.userId !== userId)
      return res.status(406).json({ message: "Wrong user requests" });

    if (boardPost.comments.length > 0)
      return res.status(406).json({ message: "The board post has comments" });

    await BoardPost.findByIdAndRemove(id);

    res.status(200).json("Success");
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Something went wrong" });
  }
};

export const getBoardPost = async (req, res) => {
  const { id } = req.params;
  try {
    const boardPost = await BoardPost.findById(id);
    if (!boardPost)
      return res.status(406).json({ message: "this post doesn't exist." });
    boardPost.views = boardPost.views + 1;

    const updatedBoardPost = await BoardPost.findByIdAndUpdate(id, boardPost, {
      new: true,
    });

    res.status(200).json(updatedBoardPost);
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Something went wrong" });
  }
};

export const likeBoardPost = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    const boardPost = await BoardPost.findById(id);

    const userIndex = boardPost.likes.findIndex(
      (likesId) => likesId.toString() === userId.toString()
    );

    if (userIndex === -1) {
      boardPost.likes.push(userId);
    } else {
      boardPost.likes = boardPost.likes.filter(
        (likesId) => likesId.toString() !== userId.toString()
      );
    }

    const updatedBoardPost = await BoardPost.findByIdAndUpdate(id, boardPost, {
      new: true,
    });

    res.status(200).json(updatedBoardPost);
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Something went wrong" });
  }
};

export const leaveBoardPostComment = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  const commentWithId = {
    _id: new mongoose.Types.ObjectId(),
    ...comment,
  };
  try {
    const boardPost = await BoardPost.findById(id);

    boardPost.comments.push(commentWithId);

    const updatedBoardPost = await BoardPost.findByIdAndUpdate(id, boardPost, {
      new: true,
    });

    res.status(200).json(updatedBoardPost);
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Something went wrong" });
  }
};
export const leaveBoardPostReply = async (req, res) => {
  const { id } = req.params;
  const { comment, commentId } = req.body;

  const commentWithId = {
    _id: new mongoose.Types.ObjectId(),
    ...comment,
  };
  try {
    const boardPost = await BoardPost.findById(id);

    const commentIndex = boardPost.comments.findIndex(
      (comment) => comment._id.toString() === commentId.toString()
    );

    boardPost.comments[commentIndex].replies.push(commentWithId);

    const updatedBoardPost = await BoardPost.findByIdAndUpdate(id, boardPost, {
      new: true,
    });

    res.status(200).json(updatedBoardPost);
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Something went wrong" });
  }
};

export const likeBoardPostComment = async (req, res) => {
  const { id } = req.params;
  const { userId, commentId } = req.body;
  console.log(userId);
  try {
    const boardPost = await BoardPost.findById(id);

    const commentIndex = boardPost.comments.findIndex(
      (comment) => comment._id.toString() === commentId.toString()
    );

    const likesIndex = boardPost.comments[commentIndex].likes.findIndex(
      (likesId) => likesId === userId
    );

    if (likesIndex === -1) {
      boardPost.comments[commentIndex].likes.push(userId);
    } else {
      boardPost.comments[commentIndex].likes = boardPost.comments[
        commentIndex
      ].likes.filter((likesId) => likesId !== userId);
    }
    const updatedBoardPost = await BoardPost.findByIdAndUpdate(id, boardPost, {
      new: true,
    });

    res.status(200).json(updatedBoardPost);
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Something went wrong" });
  }
};

export const likeBoardPostReply = async (req, res) => {
  const { id } = req.params;
  const { userId, commentId, replyId } = req.body;

  try {
    const boardPost = await BoardPost.findById(id);

    const commentIndex = boardPost.comments.findIndex(
      (comment) => comment._id.toString() === commentId.toString()
    );
    const replyIndex = boardPost.comments[commentIndex].replies.findIndex(
      (reply) => reply._id.toString() === replyId.toString()
    );
    const likesIndex = boardPost.comments[commentIndex].replies[
      replyIndex
    ].likes.findIndex((likesId) => likesId === userId);

    if (likesIndex === -1) {
      boardPost.comments[commentIndex].replies[replyIndex].likes.push(userId);
    } else {
      boardPost.comments[commentIndex].replies[replyIndex].likes =
        boardPost.comments[commentIndex].replies[replyIndex].likes.filter(
          (likesId) => likesId !== userId
        );
    }
    const updatedBoardPost = await BoardPost.findByIdAndUpdate(id, boardPost, {
      new: true,
    });

    res.status(200).json(updatedBoardPost);
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Something went wrong" });
  }
};

export const deleteBoardPostComment = async (req, res) => {
  const { id } = req.params;
  const { userId, commentId } = req.body;
  try {
    const boardPost = await BoardPost.findById(id);

    const commentIndex = boardPost.comments.findIndex(
      (comment) => comment._id.toString() === commentId.toString()
    );
    if (boardPost.comments[commentIndex].commentUserId !== userId)
      return res.status(401).json({ message: "Wrong request" });

    if (boardPost.comments[commentIndex].replies.length > 0) {
      boardPost.comments[commentIndex].comment = "Deleted comment";
    } else {
      boardPost.comments = boardPost.comments.filter(
        (comment) => comment._id.toString() !== commentId.toString()
      );
    }
    const updatedBoardPost = await BoardPost.findByIdAndUpdate(id, boardPost, {
      new: true,
    });

    res.status(200).json(updatedBoardPost);
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Something went wrong" });
  }
};

export const deleteBoardPostReply = async (req, res) => {
  const { id } = req.params;
  const { userId, commentId, replyId } = req.body;

  try {
    const boardPost = await BoardPost.findById(id);

    const commentIndex = boardPost.comments.findIndex(
      (comment) => comment._id.toString() === commentId.toString()
    );
    const replyIndex = boardPost.comments[commentIndex].replies.findIndex(
      (reply) => reply._id.toString() === replyId.toString()
    );
    if (
      boardPost.comments[commentIndex].replies[replyIndex].commentUserId !==
      userId
    )
      return res.status(401).json({ message: "Wrong request" });

    boardPost.comments[commentIndex].replies = boardPost.comments[
      commentIndex
    ].replies.filter((reply) => reply._id.toString() !== replyId.toString());

    const updatedBoardPost = await BoardPost.findByIdAndUpdate(id, boardPost, {
      new: true,
    });

    res.status(200).json(updatedBoardPost);
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Something went wrong" });
  }
};

export const editBoardPostComment = async (req, res) => {
  const { id } = req.params;
  const { commentId, editComment } = req.body;

  try {
    const boardPost = await BoardPost.findById(id);

    const commentIndex = boardPost.comments.findIndex(
      (comment) => comment._id.toString() === commentId.toString()
    );

    boardPost.comments[commentIndex].comment = editComment;
    boardPost.comments[commentIndex].updatedAt = Date.now();

    const updatedBoardPost = await BoardPost.findByIdAndUpdate(id, boardPost, {
      new: true,
    });

    res.status(200).json(updatedBoardPost);
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Something went wrong" });
  }
};

export const editBoardPostReply = async (req, res) => {
  const { id } = req.params;
  const { commentId, replyId, editComment } = req.body;

  try {
    const boardPost = await BoardPost.findById(id);

    const commentIndex = boardPost.comments.findIndex(
      (comment) => comment._id.toString() === commentId.toString()
    );
    const replyIndex = boardPost.comments[commentIndex].replies.findIndex(
      (reply) => reply._id.toString() === replyId.toString()
    );

    boardPost.comments[commentIndex].replies[replyIndex].comment = editComment;
    boardPost.comments[commentIndex].replies[replyIndex].updatedAt = Date.now();

    const updatedBoardPost = await BoardPost.findByIdAndUpdate(id, boardPost, {
      new: true,
    });

    res.status(200).json(updatedBoardPost);
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Something went wrong" });
  }
};

export const uploadBoardPostImage = async (req, res) => {
  const { image } = req.body;
  if (!image) return res.status(406).json({ message: "no image" });
  try {
    const uploadedImage = await cloudinary.v2.uploader.upload(image, {
      transformation: [{ width: 960, height: 540, quality: "auto" }],
    });

    res.status(200).json(uploadedImage);
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: error });
  }
};

export const getUserBoardPostList = async (req, res) => {
  const { username } = req.params;

  try {
    const boardPostList = await User.findOne({ name: username })
      .populate({ path: "boardPosts", options: { sort: { createdAt: -1 } } })
      .select("boardPosts name profilePicture bio");
    if (!boardPostList)
      return res.status(406).json({ message: "user doesn't exist" });
    res.status(200).json(boardPostList);
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Something went wrong" });
  }
};
