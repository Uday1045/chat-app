import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import Sidebar from "../components/Sidebar";

const HomePage = () => {
  const { selectedUser } = useChatStore();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024); // 1024px = tailwind's lg

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            {/* Mobile view: Show Sidebar OR Chat */}
            {isMobile ? (
              selectedUser ? <ChatContainer /> : <Sidebar />
            ) : (
              // Desktop view: Show both
              <>
                <Sidebar />
                {selectedUser ? <ChatContainer /> : <NoChatSelected />}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
