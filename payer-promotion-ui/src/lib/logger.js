function log(...args) {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log(...args);
  }

  if (process.env.NODE_ENV === 'production') {
    // TODO: Log to server
    // eslint-disable-next-line no-console
    console.log(...args);
  }
}

export default {
  log
};
