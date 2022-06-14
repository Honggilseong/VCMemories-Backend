import express from "express";
import { createPost } from "../controllers/postsControllers.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/createpost", protect, createPost);

export default router;