import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js"
import mongoose from "mongoose";




export const signup = async (req, res) => {
  const { fullName, username, password, location } = req.body;

  try {
    if (!fullName || !username || !password || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const userExists = await User.findOne({ username});
    if (userExists) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      username,
      password: hashedPassword,
    location: location.trim().toLowerCase()
    });

    generateToken(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
 username: newUser.username,
       location: newUser.location,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    console.log("error in signup controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username })

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" })
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        generateToken(user._id, res)
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
             username: user.username,
            profilePic: user.profilePic,
            location: user.location,
        })

    } catch (error) {
        console.log("error in login controller", error.message);
        res.status(500).json({ message: "Interval Server Error" });


    }

};
export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).json({ message: "Logged Out Successfully" });

    } catch (error) {
        console.log("error in logout controller", error.message);
        res.status(500).json({ message: "Interval Server Error" });

    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile pic is required" });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("error in update profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const checkAuth = (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getUsersByLocation = async (req, res) => {
  try {
    const { location } = req.params;


    const users = await User.find(
  { location: location.trim().toLowerCase() },
  "-password"
);


    res.status(200).json(users);
  } catch (error) {
    console.log("error in getUsersByLocation:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getAllLocations = async (req, res) => {
  try {
    const locations = await User.distinct("location");
    res.status(200).json(locations);
  } catch (error) {
    console.log("error in getAllLocations:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const updateLocation = async (req, res) => {
  try {
    const userId = req.user._id;
    const { location } = req.body;

    if (!location) {
      return res.status(400).json({ message: "Location is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { location },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in updateLocation:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateInterests = async (req, res) => {
  try {
    const { interests } = req.body;

    console.log("Backend received:", interests);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { interests },
      { new: true } // 🔴 critical
    );

    res.status(200).json(user);
  } catch (error) {
    console.error("Update interests error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProfileById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("fullName username interests profilePic createdAt");


    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
  