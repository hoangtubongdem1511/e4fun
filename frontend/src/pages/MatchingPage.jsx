import { useState, useCallback } from "react";
import MatchingForm from "@/components/features/Matching/MatchingForm";
import MatchingGameBoard from "@/components/features/Matching/MatchingGameBoard";
import MatchingResult from "@/components/features/Matching/MatchingResult";
import { generateMatchingGame } from "@/services/matchingService";

export default function MatchingPage() {
  const [session, setSession] = useState(null);
  const [result, setResult] = useState(null);

  const handleStart = useCallback(async (data) => {
    const res = await generateMatchingGame(data);
    setSession(res);
    setResult(null);
  }, []);

  const handleNewGame = useCallback(() => {
    setSession(null);
    setResult(null);
  }, []);

  const handleFinish = useCallback((summary) => {
    setResult(summary);
  }, []);

  if (!session) {
    return <MatchingForm onSubmit={handleStart} />;
  }

  if (result) {
    return (
      <MatchingResult
        matchedCount={result.matchedCount}
        totalPairs={result.totalPairs}
        elapsedSeconds={result.elapsedSeconds}
        wrongAttempts={result.wrongAttempts}
        completed={result.completed}
        accuracyPercent={result.accuracyPercent}
        pairs={session.pairs}
        onRetry={handleNewGame}
      />
    );
  }

  return (
    <MatchingGameBoard
      pairs={session.pairs}
      labels={session.labels}
      timeLimitMinutes={session.timeLimitMinutes}
      onNewGame={handleNewGame}
      onFinish={handleFinish}
    />
  );
}
