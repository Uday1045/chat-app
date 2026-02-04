import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";


const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile, updateInterests } = useAuthStore();

  const [selectedImg, setSelectedImg] = useState(null);
  const [interestInput, setInterestInput] = useState("");

  const [interests, setInterests] = useState([]);

const { userId } = useParams();        // profile being viewed

  const [profileUser, setProfileUser] = useState(null);

const isOwnProfile = authUser?._id === profileUser?._id;
console.log("ROUTE userId:", userId);
console.log("TOKEN:", localStorage.getItem("token"));

useEffect(() => {
  if (!userId) return;

  const fetchProfile = async () => {
    try {
      const API_BASE =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001"
    : "https://chat-app-1-s0ea.onrender.com";

const res = await fetch(
  `${API_BASE}/api/auth/profile/${userId}`,
  {
    credentials: "include",
  }
);


      if (!res.ok) {
        throw new Error("Unauthorized");
      }

      const data = await res.json();
      setProfileUser(data);
    } catch (err) {
      console.error("Profile fetch failed:", err);
    }
  };

  fetchProfile();
}, [userId]);





  // 🔹 Interests state

useEffect(() => {
  if (profileUser?.interests) {
    setInterests(profileUser.interests);
  }
}, [profileUser]);

  // 🔹 Profile image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  // 🔹 Add interest on Enter
  const addInterest = (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const value = interestInput.trim();
    if (!value) return;

    setInterests((prev) =>
      prev.includes(value) ? prev : [...prev, value]
    );
    setInterestInput("");
  };

  const removeInterest = (interest) => {
    setInterests((prev) => prev.filter((i) => i !== interest));
  };


  return (
    <div className="min-h-screen bg-base-100 pt-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-base-300 rounded-2xl p-6 shadow-lg space-y-10">

          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2 text-sm text-zinc-400">
              Your profile information
            </p>
          </div>

          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
src={
  selectedImg ||
  profileUser?.profilePic ||
  "/avatar.png"
}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-black"
              />
             {isOwnProfile && (
  <label
    htmlFor="avatar-upload"
    className={`absolute bottom-0 right-0 bg-base-content p-2 rounded-full cursor-pointer transition-all duration-200 hover:scale-105 ${
      isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
    }`}
  >
    <Camera className="w-5 h-5 text-base-200" />
    <input
      type="file"
      id="avatar-upload"
      className="hidden"
      accept="image/*"
      onChange={handleImageUpload}
      disabled={isUpdatingProfile}
    />
  </label>
)}

            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* User Info */}
          <div className="space-y-6">
            <div>
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border border-base-100">
{profileUser?.fullName}
              </p>
            </div>

            <div>
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Username
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border border-base-100">
{profileUser?.username}
              </p>
            </div>
          </div>

          {/* 🔹 Interests Section */}
          <div className="rounded-xl p-6 bg-base-200 border border-base-300">
  <h2 className="text-lg font-medium mb-4">
    {isOwnProfile ? "Your Interests" : "Interests"}
  </h2>

  {/* Input only for OWN profile */}
  {isOwnProfile && (
    <input
      type="text"
      placeholder="Type an interest and press Enter"
      value={interestInput}
      onChange={(e) => setInterestInput(e.target.value)}
      onKeyDown={addInterest}
      className="input input-bordered w-full"
    />
  )}

  <div className="flex flex-wrap gap-2 mt-4">
    {interests.map((interest) => (
      <span
        key={interest}
        className={`badge badge-primary gap-2 ${
          isOwnProfile ? "cursor-pointer" : ""
        }`}
        onClick={() => {
          if (isOwnProfile) removeInterest(interest);
        }}
      >
        {interest}
        {isOwnProfile && " ✕"}
      </span>
    ))}
  </div>

  {interests.length === 0 && (
    <p className="text-sm text-zinc-400 mt-3">
      {isOwnProfile
        ? "Add interests so people can discover you"
        : "No interests added"}
    </p>
  )}

  {/* Save button only for OWN profile */}
  {isOwnProfile && (
    <button
      onClick={() => updateInterests({ interests })}
      disabled={isUpdatingProfile}
      className="btn btn-primary mt-4"
    >
      Save Interests
    </button>
  )}
</div>

          {/* Account Info */}
          <div className="rounded-xl p-6 bg-base-200 border border-base-300">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
