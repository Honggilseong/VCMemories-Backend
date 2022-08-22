import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  title: String,
  message: String,
  name: String,
  tags: [String],
  picture: String,
  likes: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  profilePicture: String,
  userId: String,
  comments: {
    type: [
      {
        commentUserId: String,
        commentUserName: String,
        comment: String,
        createdAt: Date,
      },
    ],
  },
  isEdit: Boolean,
});

const Post = mongoose.model("Post", postSchema);

export default Post;
