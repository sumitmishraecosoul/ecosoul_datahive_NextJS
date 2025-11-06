'use client';
import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';

const ToastContext = createContext(null);

let nextId = 1;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const show = useCallback((toast) => {
    const id = nextId++;
    const { type = 'info', title, message, duration = 3500 } = toast || {};
    const createdAt = Date.now();
    setToasts((t) => [...t, { id, type, title, message, duration, createdAt }]);
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration + 200);
    }
    return id;
  }, [removeToast]);

  const api = useMemo(() => ({
    show,
    success: (message, opts = {}) => show({ type: 'success', message, ...opts }),
    error: (message, opts = {}) => show({ type: 'error', message, ...opts }),
    info: (message, opts = {}) => show({ type: 'info', message, ...opts }),
    warning: (message, opts = {}) => show({ type: 'warning', message, ...opts }),
    remove: removeToast,
  }), [show, removeToast]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed z-[9999] top-4 right-4 flex flex-col gap-3 w-[90vw] max-w-sm">
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

const iconMap = {
  success: (
    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-7.364 7.364a1 1 0 01-1.414 0L3.293 9.435a1 1 0 111.414-1.414l3.05 3.05 6.657-6.657a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
  ),
  error: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/></svg>
  ),
  info: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
  ),
  warning: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
  ),
};

const bgFor = (type) => ({
  success: 'bg-white border-emerald-500',
  error: 'bg-white border-red-500',
  info: 'bg-white border-blue-500',
  warning: 'bg-white border-amber-500'
}[type] || 'bg-white border-gray-300');

const accentFor = (type) => ({
  success: 'from-emerald-400 to-emerald-500',
  error: 'from-red-400 to-red-500',
  info: 'from-blue-400 to-blue-500',
  warning: 'from-amber-400 to-amber-500'
}[type] || 'from-gray-400 to-gray-500');

const Toast = ({ toast, onClose }) => {
  const { type, message, title /* duration, createdAt */ } = toast;
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(t);
  }, []);

  const colorChip = {
    success: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    error: 'text-red-600 bg-red-50 border-red-200',
    info: 'text-blue-600 bg-blue-50 border-blue-200',
    warning: 'text-amber-600 bg-amber-50 border-amber-200',
  }[type] || 'text-gray-600 bg-gray-50 border-gray-200';

  return (
    <div
      className={`relative overflow-hidden rounded-xl border-2 ${bgFor(type)}
                  shadow-[0_10px_30px_-10px_rgba(0,0,0,0.25)]
                  backdrop-blur-sm will-change-transform will-change-opacity
                  transition-all duration-300 ease-out
                  ${mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-[0.98]'}
                 `}
    >
      <div className="p-4 pl-3 flex items-center gap-3">
        <div className={`shrink-0 rounded-full p-2 border ${colorChip}`}>
          <div className={{}}>
            {React.cloneElement(iconMap[type], { className: `w-5 h-5 ${colorChip.split(' ')[0]}` })}
          </div>
        </div>
        <div className="flex-1 text-left">
          {title && <div className="text-[0.95rem] font-bold text-gray-900 tracking-tight">{title}</div>}
          <div className="text-[0.925rem] text-gray-800 leading-relaxed font-semibold">{message}</div>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close">
          ×
        </button>
      </div>
    </div>
  );
};

export default ToastContext;


