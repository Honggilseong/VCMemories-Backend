import mongoose from "mongoose";
import bcrypt from "bcrypt";
const saltRounds = 10;

const userSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  id: { type: String },
  profilePicture: {
    type: String,
    default:
      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  isPrivate: { type: Boolean, default: false },
  userTitle: { type: String, default: "" },
  userPosts: [
    {
      _id: String,
      title: String,
      picture: String,
      message: String,
      tags: [String],
      name: String,
      profilePicture: String,
      userId: String,
      likes: [String],
      createdAt: Date,
      comments: [
        {
          commentUserId: String,
          commentUserName: String,
          comment: String,
          createdAt: Date,
        },
      ],
      isEdit: Boolean,
    },
  ],
  following: {
    type: [String],
    default: [],
  },
  followers: {
    type: [String],
    default: [],
  },
  notifications: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      sender: String,
      notificationType: String,
      image: String,
      read: Boolean,
    },
  ],
  followRequests: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      userId: String,
      username: String,
      profileImage: String,
    },
  ],
  blockUsers: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      userId: String,
      username: String,
      profileImage: String,
    },
  ],
  bio: { type: String, default: "" },
});

userSchema.pre("save", function (next) {
  const user = this;
  if (user.isModified("password")) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hashedPassword) {
        if (err) return next(err);
        user.password = hashedPassword;
        next();
      });
    });
  } else {
    next();
  }
});
const User = mongoose.model("User", userSchema);

export default User;
