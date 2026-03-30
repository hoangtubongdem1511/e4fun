import { Link } from "react-router-dom";
import { Search, PenTool, MessagesSquare, Gamepad2, Puzzle } from "lucide-react";

export default function Home() {
  const features = [
    {
      title: "Từ điển thông minh",
      description: "Tra cứu từ vựng với định nghĩa chi tiết, ví dụ và phát âm",
      link: "/dictionary",
      color: "from-blue-500 to-blue-600",
      icon: Search,
    },
    {
      title: "Luyện viết AI",
      description: "Viết bài và nhận phản hồi chi tiết từ AI tutor",
      link: "/writing",
      color: "from-green-500 to-green-600",
      icon: PenTool,
    },
    {
      title: "Tư vấn thông minh",
      description: "Chat với AI tutor về mọi vấn đề tiếng Anh",
      link: "/chatbot",
      color: "from-purple-500 to-purple-600",
      icon: MessagesSquare,
    },
    {
      title: "Bài tập tương tác",
      description: "Làm quiz game với câu hỏi được tạo bởi AI",
      link: "/assignment",
      color: "from-pink-500 to-pink-600",
      icon: Gamepad2,
    },
    {
      title: "Trò chơi ghép đôi",
      description: "Ghép từ và định nghĩa theo chủ đề với AI",
      link: "/matching",
      color: "from-indigo-500 to-purple-600",
      icon: Puzzle,
    }
  ];

  const topFeatures = features.slice(0, 3);
  const bottomFeatures = features.slice(3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                English4Fun
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Học tiếng Anh thông minh cùng AI Gemini. Từ điển, luyện viết, tư vấn và bài tập tương tác.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Feature Cards (2 rows: 3 + 2) */}
        <div className="space-y-6">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topFeatures.map((feature) => (
              <Link
                key={feature.link}
                to={feature.link}
                className="group bg-white/80 dark:bg-white/10 backdrop-blur-sm rounded-3xl p-7 border border-gray-200/80 dark:border-white/20 hover:border-gray-300 dark:hover:border-white/40 transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-center">
                  <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-5 text-white group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-10 w-10" strokeWidth={2.25} aria-hidden="true" />
                  </div>
                  <h3 className="text-gray-900 dark:text-white font-bold text-xl mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Row 2 (centered) */}
          <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
            {bottomFeatures.map((feature) => (
              <Link
                key={feature.link}
                to={feature.link}
                className="group bg-white/80 dark:bg-white/10 backdrop-blur-sm rounded-3xl p-7 border border-gray-200/80 dark:border-white/20 hover:border-gray-300 dark:hover:border-white/40 transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-center">
                  <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-5 text-white group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-10 w-10" strokeWidth={2.25} aria-hidden="true" />
                  </div>
                  <h3 className="text-gray-900 dark:text-white font-bold text-xl mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>


      </div>
    </div>
  );
}