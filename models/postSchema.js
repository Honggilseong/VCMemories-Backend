import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  title: String,
  message: String,
  name: String,
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
  postType: String,
  images: [String],
  imageDeleteIds: [String],
});

const Post = mongoose.model("Post", postSchema);

export default Post;
