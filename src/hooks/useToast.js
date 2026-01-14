import { useState, useCallback } from 'react';

/**
 * useToast - Custom hook for managing toast notifications
 * 
 * Returns object with:
 * - toasts: Array of current toast objects
 * - showToast(message, type, duration): Show a toast notification
 * - closeToast(id): Close a specific toast
 * - clearAll(): Close all toasts
 * 
 * Example:
 *   const { toasts, showToast } = useToast();
 *   showToast('Lagu berhasil disimpan!', 'success', 3000);
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    
    const newToast = {
      id,
      message,
      type, // 'success', 'error', 'warning', 'info'
      duration
    };

    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const closeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods
  const success = useCallback((message, duration = 3000) => {
    return showToast(message, 'success', duration);
  }, [showToast]);

  const error = useCallback((message, duration = 5000) => {
    return showToast(message, 'error', duration);
  }, [showToast]);

  const warning = useCallback((message, duration = 4000) => {
    return showToast(message, 'warning', duration);
  }, [showToast]);

  const info = useCallback((message, duration = 3000) => {
    return showToast(message, 'info', duration);
  }, [showToast]);

  return {
    toasts,
    showToast,
    closeToast,
    clearAll,
    success,
    error,
    warning,
    info
  };
}
