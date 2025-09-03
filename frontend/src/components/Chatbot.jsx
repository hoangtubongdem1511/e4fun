import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useDropzone } from "react-dropzone";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deepThink, setDeepThink] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    onDrop: async (acceptedFiles) => {
      const uploadedUrls = [];
      for (const file of acceptedFiles) {
        try {
          const formData = new FormData();
          formData.append('image', file);
          const response = await axios.post('http://localhost:5000/api/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          uploadedUrls.push(response.data.url);
        } catch (error) {
          console.error('Upload error:', error);
          alert('Lỗi upload ảnh. Vui lòng thử lại.');
        }
      }
      setUploadedImages(prev => [...prev, ...uploadedUrls]);
    }
  });

  const clearChat = () => {
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
      images: uploadedImages,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setUploadedImages([]);
    setIsLoading(true);

    try {
      const res = await axios.post("/api/chatbot", { 
        message: input, 
        images: uploadedImages,
        deepThink 
      });
      
      const aiMessage = {
        id: Date.now() + 1,
        role: 'ai',
        content: res.data.candidates?.[0]?.content?.parts?.[0]?.text || "Không có phản hồi",
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
    <div className="flex flex-col h-[800px] w-full max-w-5xl bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl">
      {/* Chat Header */}
      <div className="p-6 border-b border-white/20 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              AI
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">AI English Tutor</h3>
              <p className="text-gray-300 text-sm">Hỗ trợ học tiếng Anh 24/7</p>
            </div>
          </div>
          
          {/* Clear Chat Button */}
          {messages.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-4 py-2 text-sm bg-red-500/20 text-red-300 border border-red-500/30 rounded-xl hover:bg-red-500/30 transition-all duration-300"
            >
              🗑️ Xóa trò chuyện
            </button>
          )}
        </div>
        
        <div className="flex space-x-3 mt-4">
          <button
            onClick={() => setDeepThink(!deepThink)}
            className={`px-4 py-2 text-sm rounded-xl transition-all duration-300 ${
              deepThink 
                ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' 
                : 'bg-gray-800/50 text-gray-300 border border-gray-600/50 hover:bg-gray-700/50'
            }`}
          >
            🧠 Suy nghĩ sâu
          </button>
        </div>
      </div>

      {/* Clear Chat Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-2xl max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-2 text-white">Xác nhận xóa</h3>
            <p className="text-gray-300 mb-4">
              Bạn có chắc chắn muốn xóa toàn bộ cuộc trò chuyện này? Hành động này không thể hoàn tác.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-800/50 text-gray-300 border border-gray-600/50 rounded-xl hover:bg-gray-700/50 transition-all duration-300"
              >
                Hủy
              </button>
              <button
                onClick={clearChat}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-300"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-300 py-12">
            <div className="text-6xl mb-4">👋</div>
            <h3 className="text-xl font-semibold text-white mb-2">Chào bạn!</h3>
            <p className="text-gray-300">Tôi là AI tutor, hãy hỏi tôi bất cứ điều gì về tiếng Anh nhé!</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                  : 'bg-gradient-to-r from-purple-500 to-purple-600'
              }`}>
                {msg.role === 'user' ? 'U' : 'AI'}
              </div>
              
              {/* Message Bubble */}
              <div
                className={`p-4 rounded-2xl shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-500/20 text-white border border-blue-500/30'
                    : 'bg-white/10 text-white border border-white/20'
                }`}
              >
                <div className="text-xs opacity-70 mb-2">
                  {msg.timestamp}
                </div>
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
                {/* Display Images */}
                {msg.images && msg.images.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {msg.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="uploaded"
                        className="w-24 h-24 object-cover rounded-xl border border-white/20"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-sm font-bold">
                AI
              </div>
              <div className="bg-white/10 p-4 rounded-2xl border border-white/20">
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
        <div className="p-4 border-t border-white/20 bg-white/5">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-sm text-gray-300">📷 Ảnh đã chọn:</span>
            <button
              onClick={() => setUploadedImages([])}
              className="text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              Xóa tất cả
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            {uploadedImages.map((img, idx) => (
              <div key={idx} className="relative">
                <img
                  src={img}
                  alt="preview"
                  className="w-20 h-20 object-cover rounded-xl border border-white/20"
                />
                <button
                  onClick={() => setUploadedImages(prev => prev.filter((_, i) => i !== idx))}
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
      <div className="p-6 border-t border-white/20 rounded-b-2xl">
        <form onSubmit={sendMessage} className="flex space-x-3">
          {/* Upload Button */}
          <div {...getRootProps()} className="cursor-pointer">
            <input {...getInputProps()} />
            <button
              type="button"
              className={`px-4 py-3 rounded-xl transition-all duration-300 ${
                isDragActive 
                  ? 'bg-blue-500/20 border-blue-500/30 text-blue-300 border' 
                  : 'bg-gray-800/50 text-gray-300 border border-gray-600/50 hover:bg-gray-700/50'
              }`}
            >
              📷
            </button>
          </div>
          
          <input
            className="flex-1 px-4 py-3 bg-gray-800/50 border-2 border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300"
            placeholder="Nhập tin nhắn..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || (!input.trim() && uploadedImages.length === 0)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              isLoading || (!input.trim() && uploadedImages.length === 0)
                ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
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
          </button>
        </form>
      </div>
    </div>
  );
}