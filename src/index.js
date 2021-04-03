import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import 'antd/lib/tabs/style/css';
import 'antd/lib/button/style/css';
import 'antd/lib/select/style/css';
import 'antd/lib/menu/style/css';
import 'antd/lib/drawer/style/css';
import 'antd/lib/input/style/css';
import 'antd/lib/input-number/style/css';
import 'antd/lib/checkbox/style/css';
import 'antd/lib/radio/style/css';
import 'antd/lib/slider/style/css';
import 'antd/lib/switch/style/css';
import 'antd/lib/timeline/style/css';
import 'antd/lib/message/style/css';
import 'antd/lib/alert/style/css';
import './index.css';
import './styles/theme/default.css';
import App from './App';
// import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.register();
