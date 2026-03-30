import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useDropzone } from "react-dropzone";
import { sendChatMessageText } from "@/services/chatbotService";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Bot, Camera, Hand, User } from "lucide-react";

const MAX_IMAGES = 4;
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
const MAX_TOTAL_SIZE = 12 * 1024 * 1024; // 12MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp","image/jpg"];

function revokeMessageBlobUrls(msgs) {
  msgs.forEach((msg) => {
    if (msg.role !== "user" || !Array.isArray(msg.images)) return;
    msg.images.forEach((url) => {
      if (typeof url === "string" && url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    });
  });
}

/** Collage for user message images: one rounded frame, thin gutters, 1–4+ tiles */
function MessageImageCollage({ urls }) {
  if (!Array.isArray(urls) || urls.length === 0) return null;

  const count = urls.length;
  const shellClass =
    "w-full max-w-lg sm:max-w-xl md:max-w-2xl overflow-hidden rounded-2xl bg-white/30 dark:bg-white/15 ring-1 ring-gray-200/60 dark:ring-white/20";
  const cellClass =
    "relative min-h-0 min-w-0 overflow-hidden bg-gray-900/5 dark:bg-black/20";

  if (count === 1) {
    return (
      <div className={shellClass}>
        <div className="relative aspect-square w-full">
          <img
            src={urls[0]}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    );
  }

  if (count === 2) {
    return (
      <div className={shellClass}>
        <div className="grid aspect-square w-full grid-cols-2 grid-rows-1 gap-0.5">
          {urls.slice(0, 2).map((src, idx) => (
            <div key={`${src}-${idx}`} className={cellClass}>
              <img
                src={src}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (count === 3) {
    return (
      <div className={shellClass}>
        <div className="grid aspect-square w-full grid-cols-2 grid-rows-2 gap-0.5">
          <div className={`${cellClass} row-span-2`}>
            <img
              src={urls[0]}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className={`${cellClass} col-start-2 row-start-1`}>
            <img
              src={urls[1]}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className={`${cellClass} col-start-2 row-start-2`}>
            <img
              src={urls[2]}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    );
  }

  const more = count > 4 ? count - 4 : 0;
  const tiles = count > 4 ? urls.slice(0, 4) : urls;

  return (
    <div className={shellClass}>
      <div className="grid aspect-square w-full grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] grid-rows-2 gap-0.5">
        {tiles.map((src, idx) => (
          <div key={`${src}-${idx}`} className={cellClass}>
            <img
              src={src}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            {more > 0 && idx === 3 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-lg font-semibold text-white">
                +{more}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deepThink, setDeepThink] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      revokeMessageBlobUrls(messagesRef.current);
    };
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    onDrop: (acceptedFiles) => {
      const nextItems = [];
      const currentCount = uploadedImages.length;
      const currentTotal = uploadedImages.reduce((sum, item) => sum + item.file.size, 0);
      let runningTotal = currentTotal;

      for (const file of acceptedFiles) {
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
          alert("Chỉ hỗ trợ ảnh JPG, PNG, WEBP.");
          continue;
        }
        if (file.size > MAX_FILE_SIZE) {
          alert(`Mỗi ảnh tối đa ${MAX_FILE_SIZE / (1024 * 1024)}MB.`);
          continue;
        }
        if (currentCount + nextItems.length >= MAX_IMAGES) {
          alert(`Tối đa ${MAX_IMAGES} ảnh mỗi lần gửi.`);
          break;
        }
        if (runningTotal + file.size > MAX_TOTAL_SIZE) {
          alert(`Tổng dung lượng ảnh không vượt quá ${MAX_TOTAL_SIZE / (1024 * 1024)}MB.`);
          break;
        }

        const previewUrl = URL.createObjectURL(file);
        nextItems.push({ file, previewUrl });
        runningTotal += file.size;
      }

      if (nextItems.length > 0) {
        setUploadedImages((prev) => [...prev, ...nextItems]);
      }
    }
  });

  const clearChat = () => {
    revokeMessageBlobUrls(messages);
    uploadedImages.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setMessages([]);
    setInput("");
    setUploadedImages([]);
    setShowClearConfirm(false);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() && uploadedImages.length === 0) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input,
      images: uploadedImages.map((img) => img.previewUrl),
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentImages = uploadedImages;
    setInput("");
    setUploadedImages([]);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("message", input);
      formData.append("deepThink", String(deepThink));
      formData.append("googleSearch", "false");
      currentImages.forEach((img) => {
        formData.append("images", img.file);
      });

      const text = await sendChatMessageText(formData);
      const aiMessage = {
        id: Date.now() + 1,
        role: 'ai',
        content: text,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'ai',
        content: "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.",
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-7xl min-h-[520px] h-[min(1180px,calc(100vh-9rem))] bg-white/80 dark:bg-white/10 backdrop-blur-sm rounded-2xl border border-gray-200/80 dark:border-white/20 shadow-2xl">
      {/* Chat Header */}
      <div className="p-6 md:p-7 border-b border-gray-200/80 dark:border-white/20 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              AI
            </div>
            <div>
              <h3 className="text-gray-900 dark:text-white font-bold text-xl md:text-2xl">AI English Tutor</h3>
              <p className="text-gray-600 dark:text-gray-300 text-base">Hỗ trợ học tiếng Anh 24/7</p>
            </div>
          </div>
          
          {/* Clear Chat Button */}
          {messages.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-4 py-2 text-sm bg-red-500/20 text-red-300 border border-red-500/30 rounded-xl hover:bg-red-500/30 transition-all duration-300"
            >
              Xóa trò chuyện
            </button>
          )}
        </div>
        
        <div className="flex space-x-3 mt-4">
          <button
            onClick={() => setDeepThink(!deepThink)}
            className={`px-4 py-2 text-sm rounded-xl transition-all duration-300 ${
              deepThink 
                ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-300 border border-yellow-500/30' 
                : 'bg-gray-100/70 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border border-gray-200/70 dark:border-gray-600/50 hover:bg-gray-200/70 dark:hover:bg-gray-700/50'
            }`}
          >
            Suy nghĩ sâu
          </button>
        </div>
      </div>

      {/* Clear Chat Confirmation Modal */}
      <Modal
        open={showClearConfirm}
        title="Xác nhận xóa"
        actions={
          <div className="flex space-x-3">
            <Button
              onClick={() => setShowClearConfirm(false)}
              className="flex-1 px-4 py-2 bg-gray-100/70 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border border-gray-200/70 dark:border-gray-600/50 rounded-xl hover:bg-gray-200/70 dark:hover:bg-gray-700/50 transition-all duration-300"
            >
              Hủy
            </Button>
            <Button
              onClick={clearChat}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-300"
            >
              Xóa
            </Button>
          </div>
        }
      >
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Bạn có chắc chắn muốn xóa toàn bộ cuộc trò chuyện này? Hành động này không thể hoàn tác.
        </p>
      </Modal>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-5">
        {messages.length === 0 && (
          <div className="text-center text-gray-600 dark:text-gray-300 py-12">
            <div className="text-6xl mb-4">👋</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Chào bạn!</h3>
            <p className="text-gray-600 dark:text-gray-300">Tôi là AI tutor, hãy hỏi tôi bất cứ điều gì về tiếng Anh nhé!</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex max-w-[90%] items-start gap-3 md:gap-4 md:max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar */}
              <div className={`w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${      
                msg.role === 'user' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                  : 'bg-gradient-to-r from-purple-500 to-purple-600'
              }`}>
                {msg.role === 'user' ? (
                  <User className="h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
                ) : (
                  <Bot className="h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
                )}
              </div>
              
              {/* Message Bubble */}
              <div
                className={`p-4 md:p-5 rounded-2xl shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-500/20 text-gray-900 dark:text-white border border-blue-500/30'
                    : 'bg-white/80 dark:bg-white/10 text-gray-900 dark:text-white border border-gray-200/80 dark:border-white/20'
                }`}
              >
                <div className="flex min-w-0 flex-col gap-4 md:gap-5">
                  <div className="shrink-0 text-xs opacity-70 md:text-sm">
                    {msg.timestamp}
                  </div>
                  <div className="prose dark:prose-invert prose-base max-w-none min-w-0 prose-p:my-0 [&_p+p]:mt-3">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                  {msg.images && msg.images.length > 0 && (
                    <div className="min-w-0 shrink-0">
                      <MessageImageCollage urls={msg.images} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3">
              <div className="w-11 h-11 md:w-12 md:h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-sm font-bold">
                <Bot className="h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
              </div>
              <div className="bg-white/80 dark:bg-white/10 p-5 rounded-2xl border border-gray-200/80 dark:border-white/20">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Upload Images Preview */}
      {uploadedImages.length > 0 && (
        <div className="p-4 border-t border-gray-200/80 dark:border-white/20 bg-gray-50/70 dark:bg-white/5">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
              <Camera className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
              Ảnh đã chọn:
            </span>
            <button
              onClick={() =>
                setUploadedImages((prev) => {
                  prev.forEach((img) => URL.revokeObjectURL(img.previewUrl));
                  return [];
                })
              }
              className="text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              Xóa tất cả
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            {uploadedImages.map((img, idx) => (
              <div key={idx} className="relative">
                <img
                  src={img.previewUrl}
                  alt="preview"
                  className="w-20 h-20 object-cover rounded-xl border border-gray-200/70 dark:border-white/20"
                />
                <button
                  onClick={() =>
                    setUploadedImages((prev) => {
                      const target = prev[idx];
                      if (target) URL.revokeObjectURL(target.previewUrl);
                      return prev.filter((_, i) => i !== idx);
                    })
                  }
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-sm hover:bg-red-600 transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-6 md:p-7 border-t border-gray-200/80 dark:border-white/20 rounded-b-2xl">
        <form onSubmit={sendMessage} className="flex space-x-3 md:space-x-4">
          {/* Upload Button */}
          <div {...getRootProps()} className="cursor-pointer">
            <input {...getInputProps()} />
            <Button
              type="button"
              className={`px-4 py-3.5 text-lg rounded-xl transition-all duration-300 ${
                isDragActive 
                  ? 'bg-blue-500/20 border-blue-500/30 text-blue-300 border' 
                  : 'bg-gray-100/70 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border border-gray-200/70 dark:border-gray-600/50 hover:bg-gray-200/70 dark:hover:bg-gray-700/50'
              }`}
            >
              <Camera className="h-6 w-6" strokeWidth={2.25} aria-hidden="true" />
            </Button>
          </div>
          
          <Input
            className="flex-1 min-h-[52px] px-4 py-3.5 text-base md:text-lg bg-gray-100/70 dark:bg-gray-800/50 border-2 border-gray-200/70 dark:border-gray-600/50 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300"
            placeholder="Nhập tin nhắn..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || (!input.trim() && uploadedImages.length === 0)}
            className={`px-6 py-3.5 rounded-xl text-base font-semibold transition-all duration-300 ${
              isLoading || (!input.trim() && uploadedImages.length === 0)
                ? 'bg-gray-300 dark:bg-gray-500 text-gray-600 dark:text-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 shadow-lg'
            }`}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}