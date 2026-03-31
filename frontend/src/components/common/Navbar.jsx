import { useState } from "react";
import { Link } from "react-router-dom";
import useTheme from "@/theme/useTheme";
import { Info } from "lucide-react";
import IntroduceApp from "@/components/common/IntroduceApp";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [showAbout, setShowAbout] = useState(false);

  return (
    <>
      <nav className="bg-white/80 dark:bg-white/10 backdrop-blur-sm border-b border-gray-200/80 dark:border-white/20 fixed top-0 left-0 right-0 z-50">
        <div className="w-full px-4 sm:px-5 lg:px-20">
          <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">E4</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-3">

            {/* About */}
            <button
              type="button"
              onClick={() => setShowAbout(true)}
              aria-label="Giới thiệu ứng dụng"
              className="inline-flex items-center justify-center p-3 rounded-xl bg-white/60 dark:bg-white/10 border border-gray-200/80 dark:border-white/20 hover:bg-white/80 dark:hover:bg-white/20 transition-colors"
            >
              <Info className="w-6 h-6 text-gray-800 dark:text-white" strokeWidth={2.25} aria-hidden="true" />
            </button>

            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? "Chuyển sang Light mode" : "Chuyển sang Dark mode"}
              className="inline-flex items-center justify-center p-3 rounded-xl bg-white/60 dark:bg-white/10 border border-gray-200/80 dark:border-white/20 hover:bg-white/80 dark:hover:bg-white/20 transition-colors"
            >
              {isDark ? (
                // Sun icon
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="M4.93 4.93l1.41 1.41" />
                  <path d="M17.66 17.66l1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="M4.93 19.07l1.41-1.41" />
                  <path d="M17.66 6.34l1.41-1.41" />
                </svg>
              ) : (
                // Moon icon
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <div className="flex items-center gap-2">
              {/* About */}
              <button
                type="button"
                onClick={() => setShowAbout(true)}
                aria-label="Giới thiệu ứng dụng"
                className="inline-flex items-center justify-center p-3 rounded-xl bg-white/60 dark:bg-white/10 border border-gray-200/80 dark:border-white/20 hover:bg-white/80 dark:hover:bg-white/20 transition-colors"
              >
                <Info className="w-6 h-6 text-gray-800 dark:text-white" strokeWidth={2.25} aria-hidden="true" />
              </button>

              {/* Theme toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={isDark ? "Chuyển sang Light mode" : "Chuyển sang Dark mode"}
                className="inline-flex items-center justify-center p-3 rounded-xl bg-white/60 dark:bg-white/10 border border-gray-200/80 dark:border-white/20 hover:bg-white/80 dark:hover:bg-white/20 transition-colors"
              >
                {isDark ? (
                  <svg
                    className="w-6 h-6 text-gray-800 dark:text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2" />
                    <path d="M12 20v2" />
                    <path d="M4.93 4.93l1.41 1.41" />
                    <path d="M17.66 17.66l1.41 1.41" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                    <path d="M4.93 19.07l1.41-1.41" />
                    <path d="M17.66 6.34l1.41-1.41" />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6 text-gray-800 dark:text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
                  </svg>
                )}
              </button>

              {/* Hamburger (existing placeholder) */}
              <button className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
          </div>
        </div>
      </nav>

      <IntroduceApp open={showAbout} onClose={() => setShowAbout(false)} />
    </>
  );
}

