import express from "express";
import {
  createPost,
  deletePost,
  deleteUserComment,
  editUserPost,
  getHashtagPosts,
  getNotificationsPost,
  getPosts,
  leaveComment,
  likePost,
  mentionUsersNotification,
} from "../controllers/postsControllers.js";
import protect from "../middleware/authMiddleware.js";
import { upload } from "../util/multer.js";

const router = express.Router();

router.post("/", protect, getPosts);
router.delete("/:id", protect, deletePost);
router.delete("/:id/deleteusercomment", protect, deleteUserComment);
router.patch("/:id/likepost", protect, likePost);
router.patch("/:id/leavecomment", protect, leaveComment);
router.patch("/edit/:id", protect, editUserPost);
router.patch("/:id/mentionuser", protect, mentionUsersNotification);
router.patch("/:id/notificationpost", protect, getNotificationsPost);
router.patch("/createpost", [protect, upload.array("image")], createPost);
router.get("/explore/hashtags/:hashtag", protect, getHashtagPosts);

export default router;
