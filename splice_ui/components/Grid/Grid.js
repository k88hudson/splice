import React from 'react';
import classnames from 'classnames';

function createGridClass(displayName, className) {
  return React.createClass({
    displayName,
    render: function () {
      return (<div className={className}>
        {this.props.children}
      </div>);
    }
  });
}

export const Wrapper = createGridClass('Wrapper', 'grid-wrapper');
export const Page = React.createClass({
  render: function () {
    return (<div className={classnames('grid-page', {'inner-scroll': this.props.innerscroll})}>
      {this.props.children}
    </div>);
  }
});
export const Sidebar = createGridClass('Sidebar', 'grid-sidebar');
export const Main = createGridClass('Main', 'grid-main');
