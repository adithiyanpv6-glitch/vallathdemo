import React from 'react';
import { useDemo } from '../context/DemoContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useDemo();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let style = 'bg-[#1A2B4C] text-white border-ink-500';
        let Icon = Info;

        if (toast.type === 'success') {
          style = 'bg-emerald-900 text-emerald-50 border-emerald-700';
          Icon = CheckCircle2;
        } else if (toast.type === 'warning') {
          style = 'bg-amber-900 text-amber-50 border-amber-700';
          Icon = AlertCircle;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-2.5 p-3.5 rounded-2xl border shadow-xl text-xs backdrop-blur-md animate-in slide-in-from-bottom-2 duration-200 ${style}`}
          >
            <Icon className="w-4 h-4 shrink-0 mt-0.5 text-gold-400" />
            <span className="flex-1 leading-snug">{toast.text}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-md hover:bg-white/10 opacity-70 hover:opacity-100 transition"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
