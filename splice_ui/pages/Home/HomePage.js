import React from 'react';
import { connect } from 'react-redux';

import { Page, Sidebar, Main } from 'components/Grid/Grid';

const HomePage = React.createClass({
  render: function () {
    return (<Page>
      Welcome to splice!
    </Page>);
  }
});

function select(state) {
  return state;
}

export const Home = connect(select)(HomePage);
