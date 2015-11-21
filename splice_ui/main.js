import React from 'react';
import ReactDOM from 'react-dom';
import { combineReducers } from 'redux';
import { Provider } from 'react-redux';

import Routes from './routes';
import finalCreateStore from './lib/finalCreateStore';
import reducers from './reducers';

const reducer = combineReducers(reducers);
const store = finalCreateStore(reducer);

const App = React.createClass({
  render: function () {
    return (<div>
      <Routes />
    </div>);
  }
});

ReactDOM.render(<App />, document.getElementById('content'));
