'use client';

import { useCallback } from 'react';
import { toast } from 'react-toastify';

const useConfirmationToast = () => {
  const showConfirmationToast = useCallback(({
    message,
    onConfirm,
    onCancel,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    values = []
  }) => {
    const toastId = toast(
      <div>
        <p>{message}</p>
        <div className="d-flex justify-content-between">
          <button
            className="btn btn-secondary"
            onClick={() => {
              if (onCancel) onCancel(values);
              toast.dismiss(toastId);
            }}
          >
            {cancelText}
          </button>
          <button
            className="btn btn-danger"
            onClick={() => {
              if (onConfirm) onConfirm(values);
              toast.dismiss(toastId);
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>,
      {
        position: 'top-center',
        autoClose: false,
        closeButton: false,
        draggable: false,
        progress: undefined,
      }
    );
  }, []);

  return { showConfirmationToast };
};

export default useConfirmationToast;