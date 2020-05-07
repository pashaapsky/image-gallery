import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';

import { Provider } from 'react-redux';

// импорт компонентов
import App from './App';

import appReducer from './store/reducers/app-reducers';

// импорт css
import './css/styles.css';
import './css/main-block.css';
import './css/header.css';

const store = createStore(appReducer);

ReactDOM.render(
  <Provider store={store}>
    <App store={store} />
  </Provider>,
  document.getElementById('root'),
);
