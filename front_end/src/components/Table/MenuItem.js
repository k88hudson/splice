import React from 'react';

export default React.createClass({
  displayName: 'MenuItem',
  render: function() {
    return (
      <li key={this.props.key}>
        <input type="checkbox"
          checked={this.props.value}
          onChange={this.props.onChange}/>
        {this.props.label}
      </li>
    );
  }
});
