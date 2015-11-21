import React from 'react';
import { connect } from 'react-redux';
import TopBar from 'components/TopBar/TopBar';
import { Wrapper } from 'components/Grid/Grid';

const AppPage = React.createClass({
  render: function () {
    return (<Wrapper>
      <TopBar history={this.props.history} />
      {this.props.children}
    </Wrapper>);
  }
});

function select(state) {
  return state;
}

export const App = connect(select)(AppPage);
