import express from "express";
import { checkAuth,signup,login,logout,updateProfile, getUsersByLocation,
  getAllLocations,updateInterests,getProfileById,
  updateLocation} from "../controllers/auth.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router= express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);

router.put("/update-profile", updateProfile);
router.put("/update-interest", updateInterests);
router.put("/update-location",  updateLocation);


router.get("/check",checkAuth);
router.get("/locations", getAllLocations);
router.get("/location/:location", getUsersByLocation);
router.get("/profile/:userId", getProfileById);
export default router;
