// hooks/useConfirmationToast.js

import { toast } from 'react-toastify';

const useConfirmationToast = ({ message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel' }) => {
  const showConfirmationToast = () => {
    const toastId = toast(
      <div>
        <p>{message}</p>
        <div className="d-flex justify-content-between">
          <button
            className="btn btn-secondary"
            onClick={() => handleCancel(toastId)}
          >
            {cancelText}
          </button>
          <button
            className="btn btn-danger"
            onClick={() => handleConfirm(toastId)}
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

  const handleConfirm = (toastId) => {
    onConfirm();
    toast.dismiss(toastId); 
  };

  const handleCancel = (toastId) => {
    onCancel();
    toast.dismiss(toastId); 
  };

  return { showConfirmationToast };
};

export default useConfirmationToast;
