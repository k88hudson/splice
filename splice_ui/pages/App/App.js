import React from 'react';

export default React.createClass({
  displayName: 'App',
  render: function () {
    return (<div>
      Splice
      {this.props.children}
    </div>);
  }
});
