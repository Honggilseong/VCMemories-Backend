import express from "express";
import { reportPost } from "../controllers/reportController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, reportPost);

export default router;
