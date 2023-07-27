import { configureStore } from './configure-store';
import defaultStore from './default-store';
import keycode from 'keycode';

const applicationName = 'template';
// sessionStorage key
const sessionStorageKey = 'session-' + applicationName + '-store';
const isDevelopment = process.env.NODE_ENV === 'development';
/**
 * create redux store for the application based on the environment
 */
export const createStore = () => {
  let initialState = defaultStore;

  // populate the store from the sessionStorage for incremental development
  if (isDevelopment && window.sessionStorage) {
    try {
      if (sessionStorage[sessionStorageKey])
        // decode the data, then parse it
        initialState = JSON.parse(atob(sessionStorage[sessionStorageKey]));

      // add a listener for Alt + x to reset the store and reload the page
      window.addEventListener('keydown', function(event) {
        if (!event.altKey) return;

        if (event.keyCode && keycode.names[event.keyCode] === 'x') {
          sessionStorage[sessionStorageKey] = '';
          window.location.reload();
        }
      });
    } catch (e) {
      // do nothing
    }
  }

  const store = configureStore(initialState);

  // in the development environment subscribe to store changes
  // and store it in the sessionStorage
  if (isDevelopment && window.sessionStorage) {
    store.subscribe(() => {
      try {
        // encode the JSON string
        sessionStorage[sessionStorageKey] = btoa(
          JSON.stringify(store.getState())
        );
      } catch (e) {
        // do nothing
      }
    });
  }

  return store;
};
