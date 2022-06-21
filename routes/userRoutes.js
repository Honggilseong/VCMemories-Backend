import express from "express";
import {
  getSearchingUser,
  getUserInfo,
  signin,
  signup,
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.get("/getuserinfo/:id", protect, getUserInfo);
router.get("/:username", protect, getSearchingUser);
export default router;
