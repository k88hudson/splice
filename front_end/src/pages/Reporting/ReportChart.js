
import React from 'react';

import ReactHighcharts from 'react-highcharts/bundle/highcharts';

export default React.createClass({
  getDefaultProps: function() {
    return {
      config: {}
    };
  },
  render: function() {
    const config = _.assign({}, {
      credits: {
        enabled: false
      }
    }, this.props.config);
    return (<div><ReactHighcharts config={config} /></div>);
  }
});
