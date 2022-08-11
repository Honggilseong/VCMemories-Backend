import express from "express";
import {
  acceptFollowRequest,
  deleteAllFollowRequests,
  deleteFollowRequest,
  deleteNotifications,
  deleteUser,
  followUser,
  getAllUsers,
  getSearchingUser,
  getUserInfo,
  readNotification,
  sendFollowRequest,
  sendNotification,
  signin,
  signup,
  switchAccountState,
  uploadProfileImage,
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.patch("/followuser/:id", protect, followUser);
router.patch("/uploadprofileimage", protect, uploadProfileImage);
router.patch("/:id/notification", protect, sendNotification);
router.patch("/:id/readnotification", protect, readNotification);
router.patch("/:id/deletenotifications", protect, deleteNotifications);
router.patch("/:id/followrequest", protect, sendFollowRequest);
router.patch("/:id/acceptfollowrequest", protect, acceptFollowRequest);
router.patch("/:id/deletefollowrequest", protect, deleteFollowRequest);
router.patch("/:id/switchaccountstate", protect, switchAccountState);
router.patch("/:id/deleteallfollowrequests", protect, deleteAllFollowRequests);
router.get("/getuserinfo/:id", protect, getUserInfo);
router.get("/search/:username", protect, getSearchingUser);
router.get("/getallusers", protect, getAllUsers);
router.delete("/deleteaccount/:id", protect, deleteUser);
export default router;
