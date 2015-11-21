import React from 'react';
import ReactDOM from 'react-dom';
import { combineReducers } from 'redux';
import { Provider } from 'react-redux';

import Routes from './routes';
import finalCreateStore from './lib/finalCreateStore';
import reducers from './reducers';

const reducer = combineReducers(reducers);
const store = finalCreateStore(reducer);
const DevTools = __CONFIG__.DEVTOOLS === true ? require('components/DevTools/DevTools') : null;

const App = React.createClass({
  render: function () {
    return (<div>
      <Provider store={store}>
        <Routes />
      </Provider>
      {DevTools ? <DevTools store={store} /> : null}
    </div>);
  }
});

ReactDOM.render(<App />, document.getElementById('content'));
