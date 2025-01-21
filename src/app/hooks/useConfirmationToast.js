"use client"

import { toast } from 'react-toastify';

const useConfirmationToast = ({ message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel' }) => {
  const showConfirmationToast = (values = []) => {
    const toastId = toast(
      <div>
        <p>{message}</p>
        <div className="d-flex justify-content-between">
          <button
            className="btn btn-secondary"
            onClick={() => handleCancel(toastId, values)}
          >
            {cancelText}
          </button>
          <button
            className="btn btn-danger"
            onClick={() => handleConfirm(toastId, values)}
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
  };

  const handleConfirm = (toastId, values) => {
    onConfirm(values);
    toast.dismiss(toastId);
  };

  const handleCancel = (toastId, values) => {
    onCancel(values);
    toast.dismiss(toastId);
  };

  return { showConfirmationToast };
};

export default useConfirmationToast;
