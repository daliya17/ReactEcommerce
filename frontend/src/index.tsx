import React from 'react';
import ReactDOM from 'react-dom/client';
import '../src/style/css/index.css';
import App from './App';
import '@athena/forge/dist/forge.css';
import { store } from './store/ConfigureStore';
import { Provider } from 'react-redux';
import reportWebVitals from './reportWebVitals';
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.Fragment>
    <Provider store={store}>
      <App />
    </Provider>
  </React.Fragment>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
