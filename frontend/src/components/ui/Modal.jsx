export default function Modal({ open, title, children, actions }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/90 dark:bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/80 dark:border-white/20 shadow-2xl max-w-sm mx-4">
        {title ? (
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
            {title}
          </h3>
        ) : null}
        {children}
        {actions ? actions : null}
      </div>
    </div>
  );
}

