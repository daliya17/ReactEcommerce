// throw alert for the user
function alert(message) {
  let isHandled = false;
  if (window.dispatchEvent) {
    const alertEvent = new CustomEvent('display-alert', {
      detail: {
        message,
        acknowledge: () => (isHandled = true)
      }
    });
    window.dispatchEvent(alertEvent);
  }
  setTimeout(() => {
    if (!isHandled) {
      window.alert(message);
    }
  }, 100);
}

function chooseOne(options, displayMessage, callback) {
  let isHandled = false;
  if (window.dispatchEvent) {
    const chooseEvent = new CustomEvent('display-choose', {
      detail: {
        message: displayMessage,
        options,
        acknowledge: () => (isHandled = true),
        onChoose: value => callback(value)
      }
    });
    window.dispatchEvent(chooseEvent);
    setTimeout(() => {
      if (!isHandled) {
        callback(options[0]);
      }
    }, 100);
  } else {
    alert('Fatal error: user agent is not compatible');
  }
}

function confirm(displayMessage, callback) {
  let isHandled = false;
  if (window.dispatchEvent) {
    const confirmEvent = new CustomEvent('display-confirm', {
      detail: {
        message: displayMessage,
        acknowledge: () => (isHandled = true),
        onConfirm: value => callback(value)
      }
    });
    window.dispatchEvent(confirmEvent);
  }
  setTimeout(() => {
    if (!isHandled) {
      window.confirm(displayMessage) ? callback(true) : callback(false);
    }
  }, 100);
}

function showLoading(message) {
  if (window.dispatchEvent) {
    const showEvent = new CustomEvent('show-loading', {
      detail: {
        message
      }
    });
    window.dispatchEvent(showEvent);
  }
}

function hideLoading(message) {
  if (window.dispatchEvent) {
    const hideEvent = new CustomEvent('hide-loading');
    window.dispatchEvent(hideEvent);
  }
}

export default {
  alert,
  chooseOne,
  confirm,
  showLoading,
  hideLoading
};
