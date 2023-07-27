import Popup from '../lib/popup';
import Logger from '../lib/logger';

export function handleApiError(error, message, customMessageProvider) {
  parseError(error, response => {
    Logger.log(message, error, response);
    if (response && customMessageProvider) {
      let customMessage = customMessageProvider(response);
      if (customMessage) message = customMessage;
    }
    const requestId = response && response.requestId;
    if (requestId) {
      message += '\nTrace ID: ' + response.requestId;
    }
    Popup.alert(message);
  });
}

export function parseError(error, callback) {
  if (error && error.json) {
    error
      .json()
      .then(err => callback(err))
      .catch(() => callback());
  } else {
    callback();
  }
}
