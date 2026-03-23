import Navbar from "@/components/common/Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}