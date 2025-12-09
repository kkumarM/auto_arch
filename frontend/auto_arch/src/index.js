import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// Suppress ResizeObserver loop errors
const resizeObserverLoopErr = 'ResizeObserver loop completed with undelivered notifications.';
const resizeObserverLoopLimitErr = 'ResizeObserver loop limit exceeded';

const originalError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && (args[0].includes(resizeObserverLoopErr) || args[0].includes(resizeObserverLoopLimitErr))) {
    return;
  }
  originalError.call(console, ...args);
};

window.addEventListener('error', (e) => {
  if (e.message === resizeObserverLoopErr || e.message === resizeObserverLoopLimitErr) {
    e.stopImmediatePropagation();
  }
});
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
