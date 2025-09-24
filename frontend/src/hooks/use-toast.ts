"use client";

import { useState, useCallback } from "react";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
}

export interface ToastProps {
  toast: (props: Omit<Toast, "id">) => void;
  toasts: Toast[];
  dismiss: (toastId?: string) => void;
}

let toastCount = 0;

export function useToast(): ToastProps {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    ({ title, description, action, variant = "default" }: Omit<Toast, "id">) => {
      const id = (++toastCount).toString();
      const newToast: Toast = {
        id,
        title,
        description,
        action,
        variant,
      };

      setToasts((currentToasts) => [...currentToasts, newToast]);

      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        dismiss(id);
      }, 5000);
    },
    []
  );

  const dismiss = useCallback((toastId?: string) => {
    setToasts((currentToasts) => {
      if (toastId) {
        return currentToasts.filter((toast) => toast.id !== toastId);
      }
      return [];
    });
  }, []);

  return {
    toast,
    toasts,
    dismiss,
  };
}
