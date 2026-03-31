export default function Modal({
  open,
  title,
  children,
  actions,
  onClose,
  closeOnBackdrop = true,
  showCloseButton = true,
  panelClassName = "",
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={(e) => {
        if (!closeOnBackdrop) return;
        if (typeof onClose !== "function") return;
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        className={`relative bg-white/90 dark:bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/80 dark:border-white/20 shadow-2xl max-w-sm mx-4 ${panelClassName}`}
      >
        {showCloseButton && typeof onClose === "function" ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="absolute top-3 right-3 inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white/70 dark:bg-white/10 border border-gray-200/80 dark:border-white/20 text-gray-700 dark:text-gray-200 hover:bg-white/90 dark:hover:bg-white/20 transition-colors"
          >
            <span className="text-lg leading-none">×</span>
          </button>
        ) : null}
        {title ? (
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white pr-10">
            {title}
          </h3>
        ) : null}
        {children}
        {actions ? actions : null}
      </div>
    </div>
  );
}

