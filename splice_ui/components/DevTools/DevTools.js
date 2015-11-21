import React from 'react';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

export default React.createClass({
  displayName: 'DevTools',
  render: function () {
    return (<DebugPanel top right bottom>
      <DevTools store={this.props.store} monitor={LogMonitor} />
    </DebugPanel>);
  }
});
