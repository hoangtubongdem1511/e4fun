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

        <div className="bg-white/80 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-6 border border-gray-200/80 dark:border-white/20 text-center">
          <p className="text-xl font-semibold text-gray-900 dark:text-white mb-5">
            {completed ? "Hoàn thành!" : "Hết thời gian!"}
          </p>
          <div className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 tabular-nums">
            {matchedCount}/{totalPairs}
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 font-medium">
            cặp đã ghép
          </p>
        </div>

        <div className="bg-white/80 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 mb-6 border border-gray-200/80 dark:border-white/20">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            Thống kê
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Tóm tắt nhanh hiệu suất ván vừa chơi
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            <div className="rounded-xl p-4 text-center border border-blue-500/25 bg-blue-500/10 dark:bg-blue-500/15 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300 mb-1">
                Thời gian
              </p>
              <p className="text-2xl font-bold tabular-nums text-gray-900 dark:text-white">
                {formatElapsed(elapsedSeconds)}
              </p>
            </div>
            <div className="rounded-xl p-4 text-center border border-violet-500/25 bg-violet-500/10 dark:bg-violet-500/15 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300 mb-1">
                Độ chính xác
              </p>
              <p className="text-2xl font-bold tabular-nums text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-purple-500">
                {accuracyPercent ?? 0}%
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                theo lượt thử
              </p>
            </div>
            <div
              className={`rounded-xl p-4 text-center border min-w-0 ${
                wrongAttempts > 0
                  ? "border-amber-500/35 bg-amber-500/10 dark:bg-amber-500/15"
                  : "border-gray-200/80 dark:border-white/15 bg-gray-100/50 dark:bg-white/5"
              }`}
            >
              <p
                className={`text-xs font-semibold uppercase tracking-wide mb-1 ${
                  wrongAttempts > 0
                    ? "text-amber-800 dark:text-amber-300"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                Ghép sai
              </p>
              <p className="text-2xl font-bold tabular-nums text-gray-900 dark:text-white">
                {wrongAttempts}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">lượt</p>
            </div>
          </div>
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
