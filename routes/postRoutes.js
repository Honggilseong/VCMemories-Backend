import express from "express";
import {
  createPost,
  deletePost,
  getPosts,
  likePost,
} from "../controllers/postsControllers.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getPosts);
router.post("/createpost", protect, createPost);
router.delete("/:id", protect, deletePost);
router.patch("/:id/likepost", protect, likePost);
export default router;
