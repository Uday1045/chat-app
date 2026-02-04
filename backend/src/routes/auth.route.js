import express from "express";
import { checkAuth,signup,login,logout,updateProfile, getUsersByLocation,
  getAllLocations,updateInterests,getProfileById,
  updateLocation} from "../controllers/auth.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router= express.Router();

router.post("/signup",  signup);
router.post("/login", login);
router.post("/logout",protectRoute,logout);

router.put("/update-profile",protectRoute, updateProfile);
router.put("/update-interest",protectRoute, updateInterests);
router.put("/update-location",protectRoute, updateLocation);


router.get("/check",protectRoute,checkAuth);
router.get("/locations",protectRoute, getAllLocations);
router.get("/location/:location",protectRoute, getUsersByLocation);
router.get("/profile/:userId",protectRoute, getProfileById);
export default router;
