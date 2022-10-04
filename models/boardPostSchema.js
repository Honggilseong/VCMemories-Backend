import mongoose from "mongoose";

const boardSchema = mongoose.Schema({
  title: { type: String, required: true },
  username: { type: String, required: true },
  updatedAt: Date,
  createdAt: Date,
  content: { type: String, required: true },
  category: { type: String, required: true },
  views: { type: Number, default: 0 },
  userId: String,
  likes: [String],
  channel: String,
  comments: {
    type: [
      {
        commentUserId: { type: String, required: true },
        commentUserName: { type: String, required: true },
        comment: { type: String, required: true },
        createdAt: Date,
        updatedAt: Date,
        likes: [String],
        replies: {
          type: [
            {
              commentUserId: { type: String, required: true },
              commentUserName: { type: String, required: true },
              comment: { type: String, required: true },
              createdAt: Date,
              updatedAt: Date,
              likes: [String],
            },
          ],
        },
      },
    ],
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const BoardPost = mongoose.model("BoardPost", boardSchema);

export default BoardPost;
