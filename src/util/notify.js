import { toast } from 'react-toastify';

const notifySuccess = (messageText) => {
  toast.success(messageText);
}

const notifyWarning = (messageText) => {
  toast.warning(messageText);
}

const notifyError = (messageText) => {
  toast.error(messageText)
}

export {
  notifySuccess,
  notifyWarning,
  notifyError
}
