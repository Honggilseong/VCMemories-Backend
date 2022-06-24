import express from "express";
import {
  followUser,
  getAllUsers,
  getSearchingUser,
  getUserInfo,
  signin,
  signup,
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.patch("/followuser/:id", protect, followUser);
router.get("/getuserinfo/:id", protect, getUserInfo);
router.get("/search/:username", protect, getSearchingUser);
router.get("/getallusers", protect, getAllUsers);
export default router;
