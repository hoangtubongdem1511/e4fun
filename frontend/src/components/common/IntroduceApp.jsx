import Modal from "@/components/ui/Modal";
import { FolderGit2, Link2, Mail } from "lucide-react";

export default function IntroduceApp({ open, onClose }) {
  return (
    <Modal
      open={open}
      title="Giới thiệu E4Fun"
      onClose={onClose}
      panelClassName="max-w-lg md:max-w-xl p-7 md:p-8"
    >
      <div className="text-gray-600 dark:text-gray-300 text-base leading-relaxed space-y-5">
        <p>
          <span className="font-semibold text-gray-900 dark:text-white">E4Fun</span> là ứng dụng học tiếng Anh với AI
          Gemini: tra từ, luyện viết, chat tutor và luyện tập tương tác.
        </p>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white mb-2">Tính năng chính</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Từ điển thông minh</li>
            <li>Luyện viết AI (chọn level)</li>
            <li>Chatbot AI tutor</li>
            <li>Bài tập tương tác (quiz)</li>
            <li>Trò chơi ghép đôi (matching game)</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-gray-200/80 dark:border-white/20 bg-gray-50/60 dark:bg-white/5 p-4">
          <p className="font-semibold text-gray-900 dark:text-white mb-1">Tác giả: Nguyễn Nhật Bách</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <a
              href="mailto:nhatbach1511@gmail.com"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200/80 dark:border-white/20 bg-white/70 dark:bg-white/10 px-3 py-2 hover:bg-white/90 dark:hover:bg-white/15 transition-colors"
              aria-label="Email"
            >
              <Mail className="h-5 w-5 text-gray-700 dark:text-gray-200" strokeWidth={2.25} aria-hidden="true" />
              <span className="font-medium text-gray-800 dark:text-gray-100">nhatbach1511@gmail.com</span>
            </a>

            <a
              href="https://github.com/hoangtubongdem1511"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200/80 dark:border-white/20 bg-white/70 dark:bg-white/10 px-3 py-2 hover:bg-white/90 dark:hover:bg-white/15 transition-colors"
              aria-label="Github"
            >
              <FolderGit2 className="h-5 w-5 text-gray-700 dark:text-gray-200" strokeWidth={2.25} aria-hidden="true" />
              <span className="font-medium text-gray-800 dark:text-gray-100">Hoangtubongdem1511</span>
            </a>

            <a
              href="https://www.linkedin.com/in/b%C3%A1ch-nguy%E1%BB%85n-nh%E1%BA%ADt-7b1031300/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200/80 dark:border-white/20 bg-white/70 dark:bg-white/10 px-3 py-2 hover:bg-white/90 dark:hover:bg-white/15 transition-colors"
              aria-label="LinkedIn"
            >
              <Link2 className="h-5 w-5 text-gray-700 dark:text-gray-200" strokeWidth={2.25} aria-hidden="true" />
              <span className="font-medium text-gray-800 dark:text-gray-100">Bach Nguyen Nhat</span>
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
}

