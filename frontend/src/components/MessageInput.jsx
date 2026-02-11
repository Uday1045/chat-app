import { useRef, useState,useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
      const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();
  const [isSending, setIsSending] = useState(false);
  // Camera state and refs
  const [isCameraOpen, setIsCameraOpen] = useState(false);
const videoRef = useRef(null);
const streamRef = useRef(null);

const openCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });

    streamRef.current = stream;
    setIsCameraOpen(true);

  } catch (error) {
    console.error("Camera error:", error);
  }
};


const capturePhoto = async () => {
  const video = videoRef.current;

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0);

  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.8)
  );

  const file = new File([blob], "camera-photo.jpg", {
    type: "image/jpeg",
  });

  // Stop camera
  streamRef.current.getTracks().forEach((track) => track.stop());
  setIsCameraOpen(false);

  // Now send this file like your normal image upload
  handleImageUpload(file);
};
const handleImageUpload = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  await sendMessage(formData); // your existing logic
};


  const handleImageChange = (e) => {
     const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const removeImage= () => {
     setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  
  };
  const handleSendMessage = async (e) => {

      e.preventDefault();
            if (isSending) return;

    if (!text.trim() && !imagePreview) return;

try {
    setIsSending(true);
          await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
     finally {
    setIsSending(false);
  }
  };
  useEffect(() => {
  if (isCameraOpen && videoRef.current && streamRef.current) {
    videoRef.current.srcObject = streamRef.current;
  }
}, [isCameraOpen]);


 return (
  <div className="p-4 w-full">

    {/* Image Preview */}
    {imagePreview && (
      <div className="mb-3 flex items-center gap-2">
        <div className="relative">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
          />
          <button
            onClick={removeImage}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
            type="button"
          >
            <X className="size-3" />
          </button>
        </div>
      </div>
    )}

    {/* Camera Modal */}
    {isCameraOpen && (
      <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-[320px] rounded-xl"
        />

        <button
          onClick={capturePhoto}
          className="mt-4 px-6 py-2 bg-primary text-white rounded-full"
        >
          Capture
        </button>

        <button
          onClick={() => {
            streamRef.current?.getTracks().forEach((track) => track.stop());
            setIsCameraOpen(false);
          }}
          className="mt-2 text-gray-300"
        >
          Cancel
        </button>
      </div>
    )}

    {/* Message Form */}
    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
      <div className="flex-1 flex gap-2">
        <input
          type="text"
          className="w-full input input-bordered rounded-lg input-sm sm:input-md"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        {/* Gallery Button */}
        <button
          type="button"
          className={`btn btn-circle ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
          onClick={() => fileInputRef.current?.click()}
        >
          <Image size={20} />
        </button>

        {/* Camera Button */}
        <button
          type="button"
          className="btn btn-circle text-zinc-400"
          onClick={openCamera}
        >
          📷
        </button>

      </div>

      <button
        type="submit"
        className="btn btn-sm btn-circle"
        disabled={!text.trim() && !imagePreview}
      >
        <Send size={22} />
      </button>
    </form>
  </div>
);

};

export default MessageInput