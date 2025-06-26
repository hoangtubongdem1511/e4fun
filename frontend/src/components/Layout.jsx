import { Link } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Modern Navigation */}
      <nav className="bg-white/10 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">E4</span>
              </div>
              {/* <span className="text-white font-bold text-xl">E4Fun</span> */}
            </Link>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
                Trang chủ
              </Link>
              <Link to="/dictionary" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
                Từ điển
              </Link>
              <Link to="/writing" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
                Luyện viết
              </Link>
              <Link to="/chatbot" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
                Tư vấn
              </Link>
              <Link to="/assignment" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
                Bài tập
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-gray-300 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}