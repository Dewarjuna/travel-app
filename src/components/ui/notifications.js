import { toast } from 'react-toastify';

export const notifySuccess = (message) =>
  toast.success(message, {
    pauseOnFocusLoss: false,
  });

export const notifyError = (message) =>
  toast.error(message || 'Something went wrong', {
    pauseOnFocusLoss: false,
  });
