import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const [previewImg, setPreviewImg] = useState(null);

  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    listenForMessages,
    stopListening,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  // Fetch messages + socket subscription
  useEffect(() => {
    if (!selectedUser?._id) return;

    getMessages(selectedUser._id);
    listenForMessages();

    return () => stopListening();
  }, [
    selectedUser?._id,
    getMessages,
    listenForMessages,
    stopListening,
  ]);

  // Auto scroll to latest message
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Helper function to format date separator
  const formatDateSeparator = (date) => {
    const messageDate = new Date(date);
    const today = new Date();

    const isToday =
      messageDate.toDateString() === today.toDateString();

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isYesterday =
      messageDate.toDateString() === yesterday.toDateString();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";

    return messageDate.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const currentDate = new Date(message.createdAt).toDateString();
          const prevDate =
            index > 0
              ? new Date(messages[index - 1].createdAt).toDateString()
              : null;

          const showDateSeparator = currentDate !== prevDate;

          return (
            <div key={message._id}>
              {/* DATE SEPARATOR */}
              {showDateSeparator && (
                <div className="flex justify-center my-4">
                  <div className="bg-base-200 text-xs px-4 py-1 rounded-full text-gray-500 shadow-sm">
                    {formatDateSeparator(message.createdAt)}
                  </div>
                </div>
              )}

              <div
                className={`chat ${
                  message.senderId === authUser._id
                    ? "chat-end"
                    : "chat-start"
                }`}
              >
                {/* Avatar */}
                <div className="chat-image">
                  <div className="w-10 h-10 rounded-full border overflow-hidden">
                    <img
                      src={
                        message.senderId === authUser._id
                          ? authUser.profilePic || "/avatar.png"
                          : selectedUser.profilePic || "/avatar.png"
                      }
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Time */}
                <div className="chat-header mb-1">
                  <time className="text-xs opacity-50 ml-1">
                    {formatMessageTime(message.createdAt)}
                  </time>
                </div>

                {/* Message bubble */}
                <div className="chat-bubble flex flex-col">
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="sm:max-w-[200px] rounded-md mb-2 cursor-pointer hover:opacity-90"
                      onClick={() => setPreviewImg(message.image)}
                    />
                  )}

                  {message.text && (
                    <p className="text-sm break-words">
                      {message.text}
                    </p>
                  )}
                </div>

                <div ref={messageEndRef} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Image Preview Modal */}
      {previewImg && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
          onClick={() => setPreviewImg(null)}
        >
          <img
            src={previewImg}
            alt="Preview"
            className="max-w-[90%] max-h-[90%] rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
