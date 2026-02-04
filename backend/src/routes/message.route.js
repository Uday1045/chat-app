import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage,getSidebarChats } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/getlastmessages", protectRoute, getSidebarChats);


router.get("/users", protectRoute, getUsersForSidebar);
// New route to get all messages
// This route can be used to fetch all messages for the authenticated user
router.get("/:id", protectRoute, getMessages);
router.get("/getlastmessages", protectRoute, getSidebarChats);



router.post("/send/:id", protectRoute, sendMessage);

export default router;