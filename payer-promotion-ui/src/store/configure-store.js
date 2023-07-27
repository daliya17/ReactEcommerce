import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

import rootReducer from '../reducers/root';

let middleWares = [];

// thunk for asynchronous actions
middleWares.push(thunk);

// add redux logger for development environment
if (process.env.NODE_ENV === 'development') {
  const logger = createLogger({
    collapsed: (getState, action, logEntry) => !logEntry.error,
    diff: true
  });
  middleWares.push(logger);
}

const createStoreWithMiddleware = applyMiddleware(...middleWares)(createStore);

/**
 * Returns a store
 * @param {object} initialState initialState
 * @returns {object} redux store
 */
export function configureStore(initialState) {
  return createStoreWithMiddleware(rootReducer, initialState);
}
