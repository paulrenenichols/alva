/**
 * @fileoverview Accessible modal component with backdrop, keyboard navigation, and body scroll lock
 */

'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

/**
 * @description Renders an accessible modal with backdrop, keyboard navigation, and body scroll lock
 * @param isOpen - Whether the modal is currently open
 * @param onClose - Function to call when modal should be closed
 * @param children - Content to render inside the modal
 * @param title - Optional title for the modal header
 */
export function Modal({ isOpen, onClose, children, title }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-text-inverse bg-opacity-50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative bg-bg-elevated rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-border-subtle">
            <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="p-1">
              <X className="w-5 h-5" />
            </Button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
