import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users",  getUsersForSidebar);
// New route to get all messages
// This route can be used to fetch all messages for the authenticated user
router.get("/:id",  getMessages);


router.post("/send/:id",  sendMessage);

export default router;