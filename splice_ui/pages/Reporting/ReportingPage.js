import React from 'react';
import { connect } from 'react-redux';

import { Page, Sidebar, Main } from 'components/Grid/Grid';

const ReportingPage = React.createClass({
  render: function () {
    return (<Page innerscroll>
      <Sidebar>
        Some stuff
       </Sidebar>
      <Main>
         Hi!
      </Main>
      <Sidebar>
        Some stuff
       </Sidebar>
    </Page>);
  }
});

function select(state) {
  return state;
}

export const Reporting = connect(select)(ReportingPage);
