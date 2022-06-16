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
    default: new Date(),
  },
  profilePicture: String,
  userId: String,
});

const Post = mongoose.model("Post", postSchema);

export default Post;
