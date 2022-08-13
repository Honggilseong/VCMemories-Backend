import express from "express";
import {
  createPost,
  deletePost,
  deleteUserComment,
  getPosts,
  leaveComment,
  likePost,
} from "../controllers/postsControllers.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, getPosts);
router.post("/createpost", protect, createPost);
router.delete("/:id", protect, deletePost);
router.delete("/:id/deleteusercomment", protect, deleteUserComment);
router.patch("/:id/likepost", protect, likePost);
router.patch("/:id/leavecomment", protect, leaveComment);
export default router;
