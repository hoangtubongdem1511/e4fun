import { Link } from "react-router-dom";

export default function Home() {
  const features = [
    {
      title: "📚 Từ điển thông minh",
      description: "Tra cứu từ vựng với định nghĩa chi tiết, ví dụ và phát âm",
      link: "/dictionary",
      color: "from-blue-500 to-blue-600",
      icon: "🔍"
    },
    {
      title: "✍️ Luyện viết AI",
      description: "Viết bài và nhận phản hồi chi tiết từ AI tutor",
      link: "/writing",
      color: "from-green-500 to-green-600",
      icon: "📝"
    },
    {
      title: "🤖 Tư vấn thông minh",
      description: "Chat với AI tutor về mọi vấn đề tiếng Anh",
      link: "/chatbot",
      color: "from-purple-500 to-purple-600",
      icon: "💬"
    },
    {
      title: "🎯 Bài tập tương tác",
      description: "Làm quiz game với câu hỏi được tạo bởi AI",
      link: "/assignment",
      color: "from-pink-500 to-pink-600",
      icon: "🎮"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                English4Fun
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Học tiếng Anh thông minh cùng AI Gemini. Từ điển, luyện viết, tư vấn và bài tập tương tác.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link 
                to="/assignment" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                🚀 Bắt đầu học ngay
              </Link>
              <Link 
                to="/chatbot" 
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold py-4 px-8 rounded-2xl text-lg transition-all duration-300 hover:bg-white/20"
              >
                💬 Hỏi AI tutor
              </Link>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Tính năng nổi bật
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Khám phá các công cụ học tiếng Anh hiện đại được hỗ trợ bởi AI
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.link}
              className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-center">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-white font-bold text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-6">
              Tại sao chọn E4Fun?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">🤖</div>
                <div className="text-white font-semibold text-lg mb-1">AI Gemini</div>
                <div className="text-gray-300 text-sm">Công nghệ AI tiên tiến nhất</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-2">⚡</div>
                <div className="text-white font-semibold text-lg mb-1">Tương tác thời gian thực</div>
                <div className="text-gray-300 text-sm">Phản hồi nhanh chóng và chính xác</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400 mb-2">🎯</div>
                <div className="text-white font-semibold text-lg mb-1">Cá nhân hóa</div>
                <div className="text-gray-300 text-sm">Học tập theo nhu cầu riêng</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}