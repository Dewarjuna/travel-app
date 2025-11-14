import { createContext, useState, useContext } from 'react';

const ToastContext = createContext();
let toastCounter = 0;
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = 'success') => {
    const id = ++toastCounter;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };
  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };
  const getToastStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-linear-to-r from-green-500 to-green-600 border-green-600';
      case 'error':
        return 'bg-linear-to-r from-red-500 to-red-600 border-red-600';
      case 'info':
        return 'bg-linear-to-r from-blue-500 to-blue-600 border-blue-600';
      default:
        return 'bg-linear-to-r from-gray-500 to-gray-600 border-gray-600';
    }
  };
  const getIcon = (type) => {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'info': return 'ℹ';
      default: return '- ';
    }
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-3 z-50 max-w-sm">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`
              ${getToastStyles(toast.type)}
              text-white px-5 py-4 rounded-lg
              shadow-lg border-l-4
              flex items-center gap-3
              animate-bounce
              hover:shadow-xl
              transition-shadow duration-200
            `}
          >
            <span className="text-2xl font-bold shrink-0">
              {getIcon(toast.type)}
            </span>
            <span className="flex-1 font-medium">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/90 hover:text-white text-2xl font-bold leading-none shrink-0 hover:scale-110 transition-transform"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};