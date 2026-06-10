'use client';

import { useTheme } from '@/hooks/useTheme';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export default function DeleteConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isDeleting = false,
}: DeleteConfirmDialogProps) {
  const { isVoid } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className={`
        relative w-full max-w-md rounded-2xl p-6
        ${isVoid ? 'glass border border-void-purple/30' : 'glass-solar border border-realm-sun/30'}
      `}>
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className={`text-xl font-bold mb-2 ${isVoid ? 'text-void-star' : 'text-realm-foreground'}`}>
            {title}
          </h3>
          <p className={`mb-6 ${isVoid ? 'text-void-dust/80' : 'text-realm-mist/80'}`}>
            {message}
          </p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={onCancel}
              disabled={isDeleting}
              className={`
                px-5 py-2 rounded-lg transition-all duration-300
                ${isVoid
                  ? 'theme-glass-light dark:text-void-star text-realm-foreground hover:bg-void-purple/20'
                  : 'theme-glass-light text-realm-foreground hover:bg-realm-sky/20'
                }
                disabled:opacity-50
              `}
            >
              取消
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className={`
                px-5 py-2 rounded-lg transition-all duration-300
                bg-gradient-to-r from-red-500 to-red-600 text-white
                hover:shadow-lg hover:shadow-red-500/30
                disabled:opacity-50
              `}
            >
              {isDeleting ? '删除中...' : '确认删除'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
