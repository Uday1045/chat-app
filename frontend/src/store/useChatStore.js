import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  sidebarMessages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  // ================= USERS =================

  getUsersByLocation: async (location, interests) => {
    set({ isUsersLoading: true });

    try {
      const res = await axiosInstance.get(
        `/auth/location/${location}/${interests.join(",")}`
      );

      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // ================= MESSAGES =================

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });

    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser } = get();

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );

      // Optimistic update
     
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  },

  // ================= SIDEBAR =================

  getSidebarChats: async () => {
    try {
      const res = await axiosInstance.get("/messages/getlastmessages");
      set({ sidebarMessages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  },

  // ================= SOCKET =================

  listenForMessages: () => {
    const socket = useAuthStore.getState().socket;
    const authUser = useAuthStore.getState().authUser;

    if (!socket || !authUser) return;

    socket.off("newMessage"); // prevent duplicate listeners

    socket.on("newMessage", (message) => {
      const { selectedUser, messages, sidebarMessages } = get();

      const isCurrentChat =
        selectedUser &&
        (String(message.senderId) === String(selectedUser._id) ||
          String(message.receiverId) === String(selectedUser._id));

      // 1️⃣ Update open chat
      if (isCurrentChat) {
        set({
          messages: [...messages, message],
        });
      }

      // 2️⃣ Update sidebar
      const otherUserId =
        String(message.senderId) === String(authUser._id)
          ? message.receiverId
          : message.senderId;

      const existingChat = sidebarMessages.find(
        (c) => String(c._id) === String(otherUserId)
      );

      if (existingChat) {
        set({
          sidebarMessages: sidebarMessages
            .map((chat) =>
              String(chat._id) === String(otherUserId)
                ? {
                    ...chat,
                    lastMessage: message.text,
                    lastMessageTime: message.createdAt,
                    unreadCount:
                      String(message.receiverId) ===
                      String(authUser._id)
                        ? chat.unreadCount + 1
                        : 0,
                  }
                : chat
            )
            .sort(
              (a, b) =>
                new Date(b.lastMessageTime) -
                new Date(a.lastMessageTime)
            ),
        });
      } else {
        set({
          sidebarMessages: [
            {
              _id: otherUserId,
              lastMessage: message.text,
              lastMessageTime: message.createdAt,
              unreadCount:
                String(message.receiverId) ===
                String(authUser._id)
                  ? 1
                  : 0,
            },
            ...sidebarMessages,
          ],
        });
      }
    });
  },

  stopListening: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off("newMessage");
  },

  // ================= UTIL =================

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));


