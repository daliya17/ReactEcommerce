import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import deepPurple from '@material-ui/core/colors/deepPurple';

import { createStore } from './store/create-store.js';
import App from './containers/App';
import './styles/index.css';

// create and initialize the redux store
const store = createStore();

const theme = createMuiTheme({
  palette: {
    primary: deepPurple,
    secondary: blue,
  },
});

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
);
