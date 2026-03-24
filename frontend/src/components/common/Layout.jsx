import Navbar from "@/components/common/Navbar";
import InteractiveBackground from "@/components/common/InteractiveBackground";

export default function Layout({ children }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-purple-100 via-white to-purple-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <InteractiveBackground />
      <div className="relative z-10">
        <Navbar />

        {/* Main Content */}
        <main className="flex-1 pt-20">
          {children}
        </main>
      </div>
    </div>
  );
}