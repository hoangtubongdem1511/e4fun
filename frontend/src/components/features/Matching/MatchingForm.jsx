import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { matchingSchema } from "@/validators/matching.schema";

const SUGGESTED_TOPICS = [
  "Travel",
  "Technology",
  "Environment",
  "Health",
  "Education",
];

const MATCH_TYPE_OPTIONS = [
  { value: "WORD_DEFINITION", label: "Từ — Định nghĩa (Word — Definition)" },
  { value: "SYNONYM", label: "Từ đồng nghĩa (Synonym)" },
  { value: "ANTONYM", label: "Từ trái nghĩa (Antonym)" },
  { value: "PHRASE_MEANING", label: "Cụm từ — Ý nghĩa (Phrase — Meaning)" },
  { value: "IDIOM_EXPLANATION", label: "Thành ngữ — Giải thích (Idiom — Explanation)" },
  { value: "PRONUNCIATION_WORD", label: "Phát âm — Từ (IPA — Word)" },
];

const TIME_OPTIONS = [1, 2, 3, 5, 10, 15];

export default function MatchingForm({ onSubmit }) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(matchingSchema),
    defaultValues: {
      topic: "",
      matchType: "WORD_DEFINITION",
      numPairs: 8,
      timeLimitMinutes: 3,
    },
  });

  const topic = watch("topic");
  const safeTopic = typeof topic === "string" ? topic : "";

  const onFormSubmit = async (data) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
    } catch (e) {
      console.error("Matching generate error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Trò chơi ghép đôi
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Ghép các từ hoặc cụm với phần tương ứng
          </p>
        </div>

        <div className="bg-white/80 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/80 dark:border-white/20 shadow-2xl">
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
            <div className="space-y-4">
              <label className="block text-gray-900 dark:text-white font-semibold text-lg">
                Chủ đề
              </label>
              <Input
                className={`w-full px-6 py-4 rounded-xl bg-gray-100/70 dark:bg-gray-800/50 border-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ${
                  errors.topic
                    ? "border-red-400"
                    : "border-gray-200/70 dark:border-gray-600/50 focus:border-blue-400"
                }`}
                placeholder="Nhập chủ đề..."
                {...register("topic")}
              />
              {errors.topic && (
                <p className="text-red-700 dark:text-red-300 text-sm mt-2 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.topic.message}
                </p>
              )}

              <div className="space-y-3">
                <p className="text-gray-600 dark:text-gray-200 text-sm">Gợi ý chủ đề:</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_TOPICS.map((s) => (
                    <button
                      type="button"
                      key={s}
                      className="px-4 py-2 rounded-full bg-gray-100/70 dark:bg-gray-800/50 text-gray-700 dark:text-gray-200 border border-gray-200/70 dark:border-gray-600/50 hover:bg-blue-500 hover:text-white hover:border-blue-400 transition-all duration-300 text-sm font-medium"
                      onClick={() =>
                        setValue("topic", s, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
                      }
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-gray-900 dark:text-white font-semibold text-lg">
                Loại ghép
              </label>
              <select
                className="w-full px-6 py-4 rounded-xl bg-gray-100/70 dark:bg-gray-800/50 border-2 border-gray-200/70 dark:border-gray-600/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...register("matchType")}
              >
                {MATCH_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.matchType && (
                <p className="text-red-700 dark:text-red-300 text-sm">{errors.matchType.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <label className="block text-gray-900 dark:text-white font-semibold text-lg">
                Số lượng cặp (4–12)
              </label>
              <Input
                type="number"
                min={4}
                max={12}
                className={`w-full px-6 py-4 rounded-xl bg-gray-100/70 dark:bg-gray-800/50 border-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  errors.numPairs ? "border-red-400" : "border-gray-200/70 dark:border-gray-600/50"
                }`}
                {...register("numPairs", { valueAsNumber: true })}
              />
              {errors.numPairs && (
                <p className="text-red-700 dark:text-red-300 text-sm">{errors.numPairs.message}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {[4, 6, 8, 10, 12].map((n) => (
                  <button
                    key={n}
                    type="button"
                    className="px-4 py-2 rounded-lg border transition-all duration-300 bg-gray-100/70 dark:bg-gray-800/50 text-gray-700 dark:text-gray-200 border-gray-200/70 dark:border-gray-600/50 hover:bg-gray-200/70 dark:hover:bg-gray-700/50"
                    onClick={() =>
                      setValue("numPairs", n, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
                    }
                  >
                    {n} cặp
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-gray-900 dark:text-white font-semibold text-lg">
                Thời gian
              </label>
              <select
                className="w-full px-6 py-4 rounded-xl bg-gray-100/70 dark:bg-gray-800/50 border-2 border-gray-200/70 dark:border-gray-600/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...register("timeLimitMinutes")}
              >
                {TIME_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {m} phút
                  </option>
                ))}
              </select>
              {errors.timeLimitMinutes && (
                <p className="text-red-700 dark:text-red-300 text-sm">
                  {errors.timeLimitMinutes.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading || !safeTopic.trim()}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                isLoading || !safeTopic.trim()
                  ? "bg-gray-300 dark:bg-gray-500 text-gray-600 dark:text-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-white inline-block" />
                  Đang tạo trò chơi...
                </span>
              ) : (
                "Bắt đầu trò chơi"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
