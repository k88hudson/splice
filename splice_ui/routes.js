import React from 'react';
import {Router, Route, IndexRoute} from 'react-router';
import createHistory from 'history/lib/createHashHistory';
import pages from 'pages/index';

// Allows for cleaner hash-based urls
// See https://github.com/rackt/react-router/blob/master/docs/guides/basics/Histories.md#what-is-that-_kckuvup-junk-in-the-url
const history = createHistory({
  queryKey: false
});

// Always scroll to top when we load a new page
const scrollToTop = () => window.scrollTo(0, 0);

export default React.createClass({
  render() {
    return (
      <Router history={history} onUpdate={scrollToTop}>
        <Route path="/" component={pages.App}>
          <IndexRoute title="Home" component={pages.Home} />
          <Route path="reporting" title="Reporting" component={pages.Reporting} />
        </Route>
      </Router>
    );
  }
});
