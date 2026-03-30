import Button from "@/components/ui/Button";

export default function MatchingResult({
  matchedCount,
  totalPairs,
  elapsedSeconds,
  wrongAttempts,
  completed,
  accuracyPercent,
  pairs,
  onRetry,
}) {
  const formatElapsed = (sec) => {
    const s = Math.max(0, Math.floor(sec));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}:${r.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Kết quả trò chơi
        </h2>

        <div className="bg-white/80 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-6 border border-gray-200/80 dark:border-white/20">
          <p className="text-center text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {completed ? "Hoàn thành!" : "Hết thời gian!"}
          </p>
          <p className="text-center text-gray-600 dark:text-gray-300">
            Bạn đã ghép {matchedCount}/{totalPairs} cặp
          </p>
        </div>

        <div className="bg-white/80 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-6 border border-gray-200/80 dark:border-white/20">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200/80 dark:border-white/20 pb-2">
            Thống kê
          </h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li>Thời gian: {formatElapsed(elapsedSeconds)}</li>
            <li>
              Cặp được ghép: {matchedCount}/{totalPairs}
            </li>
            <li>Độ chính xác (theo lượt thử): {accuracyPercent ?? 0}%</li>
            <li>Lượt ghép sai: {wrongAttempts}</li>
          </ul>
        </div>

        <div className="bg-white/80 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-gray-200/80 dark:border-white/20">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200/80 dark:border-white/20 pb-2">
            Giải thích
          </h3>
          <ul className="space-y-4">
            {(pairs || []).map((p, idx) => (
              <li
                key={p.pairId ?? idx}
                className="rounded-xl border border-gray-200/70 dark:border-white/15 p-4 bg-gray-50/50 dark:bg-black/20"
              >
                <p className="text-gray-900 dark:text-white font-medium mb-1">
                  <span className="text-blue-600 dark:text-blue-400">{p.left}</span>
                  {" ↔ "}
                  <span className="text-purple-600 dark:text-purple-400">{p.right}</span>
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {p.explanation}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <Button
          type="button"
          onClick={onRetry}
          className="w-full py-4 px-6 rounded-xl font-bold text-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg"
        >
          Chơi lại
        </Button>
      </div>
    </div>
  );
}
