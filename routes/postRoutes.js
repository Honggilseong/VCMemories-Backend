import express from "express";
import { createPost } from "../controllers/postsControllers.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createPost);

export default router;
