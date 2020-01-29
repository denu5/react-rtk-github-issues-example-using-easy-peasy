import React from 'react';
import ReactDOM from 'react-dom';
import { StoreProvider } from 'easy-peasy';

import './index.css';
import store from 'store';

const render = () => {
  const App = require('./app/App').default;

  ReactDOM.render(
    <StoreProvider store={store}>
      <App />
    </StoreProvider>,
    document.getElementById('root')
  );
};

render();

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./app/App', render);
}
