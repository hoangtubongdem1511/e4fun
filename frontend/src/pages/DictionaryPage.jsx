import Dictionary from "@/components/features/Dictionary/Dictionary";

export default function DictionaryPage() {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Từ điển thông minh
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Tra cứu từ vựng với định nghĩa chi tiết, ví dụ và phát âm từ AI Gemini
          </p>
        </div>

        {/* Dictionary Component */}
        <Dictionary />
      </div>
    </div>
  );
}
