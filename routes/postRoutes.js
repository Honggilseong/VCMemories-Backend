import express from "express";
import { createPost, getPosts } from "../controllers/postsControllers.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getPosts);
router.post("/createpost", protect, createPost);

export default router;
