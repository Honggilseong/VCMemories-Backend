import express from "express";
import {
  createBoardPost,
  deleteBoardPost,
  deleteBoardPostComment,
  deleteBoardPostReply,
  editBoardPostComment,
  editBoardPostReply,
  getAllBoardPosts,
  getBoardPost,
  leaveBoardPostComment,
  leaveBoardPostReply,
  likeBoardPost,
  likeBoardPostComment,
  likeBoardPostReply,
  uploadBoardPostImage,
} from "../controllers/boardControllers.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/getallboardposts", getAllBoardPosts);
router.get("/getboardpost/:id", getBoardPost);
router.post("/boardpost/post", createBoardPost);
router.post("/uploadboardpostpreviewimage/:id", protect, uploadBoardPostImage);
router.patch("/leaveboardpostcomment/:id", protect, leaveBoardPostComment);
router.patch("/leaveboardpostreply/:id", protect, leaveBoardPostReply);
router.patch("/likeboardpostcomment/:id", protect, likeBoardPostComment);
router.patch("/likeboardpostreply/:id", protect, likeBoardPostReply);
router.patch("/likeboardpost/:id", protect, likeBoardPost);
router.patch("/deleteboardpost/:id", protect, deleteBoardPost);
router.patch("/deleteboardpostcomment/:id", protect, deleteBoardPostComment);
router.patch("/deleteboardpostreply/:id", protect, deleteBoardPostReply);
router.patch("/editboardpostcomment/:id", protect, editBoardPostComment);
router.patch("/editboardpostreply/:id", protect, editBoardPostReply);
export default router;
