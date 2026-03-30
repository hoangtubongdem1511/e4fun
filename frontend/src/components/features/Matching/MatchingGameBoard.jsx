import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Button from "@/components/ui/Button";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildCards(pairs, labels) {
  const list = [];
  pairs.forEach((p) => {
    list.push({
      id: `${p.pairId}-L`,
      pairId: p.pairId,
      side: "left",
      text: p.left,
      badge: labels?.left ?? "A",
    });
    list.push({
      id: `${p.pairId}-R`,
      pairId: p.pairId,
      side: "right",
      text: p.right,
      badge: labels?.right ?? "B",
    });
  });
  return shuffle(list);
}

function formatClock(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export default function MatchingGameBoard({
  pairs,
  labels,
  timeLimitMinutes,
  onNewGame,
  onFinish,
}) {
  const startedAtRef = useRef(Date.now());
  const finishReportedRef = useRef(false);
  const matchedRef = useRef([]);
  const wrongRef = useRef(0);

  const cards = useMemo(
    () => buildCards(pairs || [], labels || {}),
    [pairs, labels],
  );

  const totalSeconds = Math.max(1, (timeLimitMinutes || 3) * 60);
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [matchedPairIds, setMatchedPairIds] = useState([]);
  const [selected, setSelected] = useState([]);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [wrongCardIds, setWrongCardIds] = useState([]);
  const [ended, setEnded] = useState(false);

  const matchedSet = useMemo(() => new Set(matchedPairIds), [matchedPairIds]);

  useEffect(() => {
    matchedRef.current = matchedPairIds;
  }, [matchedPairIds]);

  useEffect(() => {
    wrongRef.current = wrongAttempts;
  }, [wrongAttempts]);

  const makeSummary = useCallback(
    (matched) => {
      const elapsedSeconds = Math.min(
        totalSeconds,
        Math.floor((Date.now() - startedAtRef.current) / 1000),
      );
      const wrong = wrongRef.current;
      const attempts = wrong + matched.length;
      const accuracyPercent =
        attempts === 0 ? 0 : Math.round((matched.length / attempts) * 100);
      return {
        matchedCount: matched.length,
        totalPairs: pairs.length,
        elapsedSeconds,
        wrongAttempts: wrong,
        completed: matched.length === pairs.length,
        accuracyPercent,
        timeLimitMinutes,
      };
    },
    [pairs.length, timeLimitMinutes, totalSeconds],
  );

  const reportFinish = useCallback(
    (summary) => {
      if (finishReportedRef.current) return;
      finishReportedRef.current = true;
      setEnded(true);
      onFinish(summary);
    },
    [onFinish],
  );

  useEffect(() => {
    if (finishReportedRef.current) return;
    if (matchedPairIds.length === pairs.length && pairs.length > 0) {
      reportFinish(makeSummary(matchedPairIds));
    }
  }, [matchedPairIds, pairs.length, makeSummary, reportFinish]);

  useEffect(() => {
    if (finishReportedRef.current) return;
    if (secondsLeft <= 0) {
      reportFinish(makeSummary(matchedRef.current));
      return;
    }
    const id = window.setTimeout(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => window.clearTimeout(id);
  }, [secondsLeft, makeSummary, reportFinish]);

  const handleCardClick = (card) => {
    if (ended || finishReportedRef.current) return;
    if (matchedSet.has(card.pairId)) return;
    if (wrongCardIds.length > 0) return;
    if (selected.includes(card.id)) return;

    if (selected.length === 0) {
      setSelected([card.id]);
      return;
    }

    const firstId = selected[0];
    const first = cards.find((c) => c.id === firstId);
    if (!first) {
      setSelected([]);
      return;
    }

    if (first.id === card.id) return;

    const second = card;
    if (first.pairId === second.pairId && first.side !== second.side) {
      setMatchedPairIds((prev) => [...prev, first.pairId]);
      setSelected([]);
      return;
    }

    setWrongAttempts((w) => w + 1);
    setWrongCardIds([first.id, second.id]);
    setSelected([]);
    window.setTimeout(() => setWrongCardIds([]), 650);
  };

  const matchedCount = matchedPairIds.length;
  const totalPairs = pairs.length;

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/80 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-200/80 dark:border-white/20 shadow-2xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Trò chơi ghép đôi
            </h1>
            <div className="flex flex-wrap items-center gap-3 md:justify-end">
              <div className="flex items-center gap-2 font-bold text-lg">
                <span className="text-gray-700 dark:text-gray-200 font-semibold">⏱</span>
                <span className="text-gray-900 dark:text-white">{formatClock(secondsLeft)}</span>
              </div>
              <Button
                type="button"
                onClick={onNewGame}
                className="px-4 py-2 rounded-xl bg-gray-100/80 dark:bg-gray-800/60 border border-gray-200/80 dark:border-white/20 text-gray-900 dark:text-white hover:bg-gray-200/80 dark:hover:bg-gray-700/60 text-sm font-semibold"
              >
                Trò chơi mới
              </Button>
            </div>
          </div>

          <p className="text-center text-gray-600 dark:text-gray-300 mb-2">
            Ghép thuật ngữ với phần tương ứng của chúng
          </p>
          <p className="text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 font-bold mb-8">
            {matchedCount} / {totalPairs} cặp đã ghép
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {cards.map((card) => {
              const isMatched = matchedSet.has(card.pairId);
              const isSelected = selected.includes(card.id);
              const isWrong = wrongCardIds.includes(card.id);
              return (
                <button
                  key={card.id}
                  type="button"
                  disabled={isMatched || ended}
                  onClick={() => handleCardClick(card)}
                  className={`
                    text-left rounded-xl border-2 p-4 min-h-[120px] flex flex-col justify-between transition-all duration-200
                    shadow-md hover:shadow-lg
                    ${
                      isMatched
                        ? "opacity-40 border-gray-300/50 dark:border-white/10 cursor-default"
                        : "border-gray-200/80 dark:border-white/20 bg-white/90 dark:bg-gray-900/40 hover:border-blue-400/60"
                    }
                    ${isSelected ? "ring-2 ring-blue-500 border-blue-500 scale-[1.02]" : ""}
                    ${isWrong ? "animate-pulse border-red-400/80" : ""}
                  `}
                >
                  <span className="text-xs font-bold uppercase tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 text-center mb-2">
                    {card.badge}
                  </span>
                  <span className="text-gray-900 dark:text-white text-sm md:text-base font-medium leading-snug text-center">
                    {card.text}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
