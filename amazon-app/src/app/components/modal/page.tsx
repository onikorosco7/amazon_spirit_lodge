'use client';

import React, { ReactNode } from 'react';

interface ModalProps {
  title: string | ReactNode;
  message?: string;
  confirmText: string;
  cancelText?: string;
  visible: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
  children?: ReactNode;
  icon?: ReactNode;
}

export default function Modal({
  visible,
  title = '¿Estás seguro?',
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  children,
  icon,
}: ModalProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-xl max-w-sm w-full border border-[#d6e5ff]">
        {/* Ícono si se pasa */}
        {icon && (
          <div className="mb-4 flex justify-center text-center">{icon}</div>
        )}

        <h3 className="text-lg font-bold text-center text-[#003580] mb-3">
          {title}
        </h3>

        {message && (
          <p className="text-sm text-gray-700 mb-4 text-center">{message}</p>
        )}

        {children && <div className="mb-4">{children}</div>}

        <div className="flex justify-end gap-2 mt-6">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-[#e0ecff] text-[#003580] rounded hover:bg-[#cfe0ff] text-sm transition"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded text-white text-sm font-semibold transition
              ${
                confirmText?.toLowerCase().includes('eliminar')
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-[#003580] hover:bg-[#002a66]'
              }
            `}
          >
            {confirmText || 'Aceptar'}
          </button>
        </div>
      </div>
    </div>
  );
}
