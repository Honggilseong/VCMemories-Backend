import mongoose from "mongoose";

const reportSchema = mongoose.Schema({
  post: {
    reportUserId: String,
    reportReason: String,
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
  },
});

const Report = mongoose.model("Report", reportSchema);

export default Report;
