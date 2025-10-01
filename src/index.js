import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import store from './store';
import { Provider } from 'react-redux';
import { history, http, decodeJwt } from './helpers';
import ActionTypes from './store/action-types';

let token = localStorage.getItem("token");
if (token) {
  try {
    const decoded = decodeJwt(token);
    const expectedIssuer = `${process.env.REACT_APP_API_URL}/auth/login`;

    if (decoded.iss !== expectedIssuer) {
      throw new Error('Invalid token issuer');
    }

    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      throw new Error('Token expired');
    }
  } catch (error) {
    token = null;
    localStorage.removeItem("token");
    store.dispatch({ type: ActionTypes.LOGOUT_USER });
    history.push('/login');
  }
}
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

const render = () => {
  root.render(
    <Provider store={store}>
      <App />
    </Provider>
  );
};
if (token) {
  http.get("/auth/user-profile").then(res => {
    store.dispatch({ type: ActionTypes.LOGIN_USER, currentUser: res.data });
    render();
  });
} else {
  render();
}
