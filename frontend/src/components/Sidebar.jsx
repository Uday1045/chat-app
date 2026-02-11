import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
  } = useChatStore();
const sidebarMessages = useChatStore((s) => s.sidebarMessages);

  const { onlineUsers,authUser } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

 const sameLocationUsers =
  authUser && authUser.location
    ? users.filter((user) => user.location === authUser.location)
    : users;

 useEffect(() => {
  getUsers();
}, [getUsers]);


const filteredUsers =
  showOnlineOnly && onlineUsers.length > 0
    ? sameLocationUsers.filter((user) => onlineUsers.includes(user._id))
    : sameLocationUsers;

   const getLastMessage = (userId) => {
  const chat = sidebarMessages.filter(
    (m) =>
      (m.senderId === userId && m.receiverId === authUser._id) ||
      (m.senderId === authUser._id && m.receiverId === userId)
  );
  return chat.at(-1) || null;
};
const getUnseenCount = (userId) => {
  if (!userId || !authUser?._id || !Array.isArray(sidebarMessages)) return 0;

  return sidebarMessages.filter(
    (msg) =>
      msg &&
      msg.senderId === userId &&
      msg.receiverId === authUser._id &&
      msg.seen === false
  ).length;
};





  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-full lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      {/* Header */}
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          {/* Show Contacts text on all screen sizes now */}
          <span className="font-medium block">Contacts</span>
        </div>

        {/* Online filter toggle - only for large screens */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
      </div>

      {/* User List */}
      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => {
  const chat = sidebarMessages.find(
    (c) => c._id === user._id
  );

  return (
    <button
      key={user._id}
      onClick={() => setSelectedUser(user)}
      className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors
        ${selectedUser?._id === user._id ? "bg-base-300" : ""}`}
    >
      <div className="relative w-8 h-8">
        <img
          src={user.profilePic || "/avatar.png"}
          alt={user.fullName}
          className="w-full h-full object-cover rounded-full"
        />
        {onlineUsers.includes(user._id) && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
        )}
      </div>

      {/* Message preview */}
      <div className="flex-1 min-w-0 text-left">
        <div className="font-medium truncate text-left">{user.fullName}</div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-zinc-400 truncate">
            {chat?.lastMessage || "No messages yet"}
          </p>

          {chat?.unreadCount > 0 && (
            <span className="ml-2 bg-primary text-white text-xs px-2 py-0.5 rounded-full">
              {chat.seen}
            </span>
          )}
        </div>
      </div>
    </button>
  );
})}


        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;