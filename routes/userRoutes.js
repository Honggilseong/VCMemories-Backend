import express from "express";
import {
  acceptFollowRequest,
  deleteAllFollowRequests,
  deleteFollowRequest,
  deleteNotifications,
  deleteUser,
  followUser,
  getAllUsers,
  getFollowUsersList,
  getSearchingUser,
  getUserInfo,
  readNotification,
  sendFollowRequest,
  sendNotification,
  signin,
  signup,
  switchAccountState,
  updateUserBio,
  uploadProfileImage,
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.post("/:id/getfollowusers", getFollowUsersList);
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
router.patch("/:id/updatebio", protect, updateUserBio);
router.get("/getuserinfo/:id", protect, getUserInfo);
router.get("/search/:username", getSearchingUser);
router.get("/getallusers", getAllUsers);
router.delete("/deleteaccount/:id", protect, deleteUser);

export default router;
