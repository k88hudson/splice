import React from 'react';
import Chart from './ReportChart';

const CATEGORIES = [
  'Automotive_General',
  'Business/ Finance_Business',
  'Entertainment_General',
  'Entertainment_Movies',
  'Entertainment_TV',
  'Health_Fitness',
  'Sports_Fantasy Football',
  'Sports_Football_General',
  'Technology_General',
  'Travel_Hotels/ Resorts',
  'Travel_Information',
  'Video Games_General'
];

const eg1 = {
  xAxis: {
    categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5']
  },
  yAxis: {
    min: 0.2,
    max: 0.35,
    title: {
      text: 'CTR'
    }
  },
  series: [
    {
      name: 'CTR',
      data: [0.252, 0.259, 0.253, 0.263, 0.264],
      showInLegend: false,
      tooltip: {
        valueSuffix: '%'
      }
    }
  ],
  title: {
    text: 'CTR for Webmaker (Oct 1 – Nov 10 2015)'
  }
};

const eg2 = {
  xAxis: {
    categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5']
  },
  yAxis: [
    {
      id: 'y_CTR',
      // min: 0.2,
      // max: 0.35,
      title: {
        text: 'CTR'
      },
      visible: false
    },
    {
      id: 'y_impressions',
      // min: 10000,
      // max: 50000,
      title: {
        text: 'Impressions'
      },
      visible: false
    }
  ],
  series: [
    {
      name: 'CTR',
      data: [0.252, 0.259, 0.253, 0.263, 0.264],
      tooltip: {
        valueSuffix: '%'
      },
      yAxis: 'y_CTR'
    },
    {
      name: 'Impressions',
      data: [13976, 19087, 20738, 29878, 30678],
      yAxis: 'y_impressions'
    }
  ],
  title: {
    text: 'CTR v.s. Impressions for Webmaker (Oct 1 – Nov 10 2015)'
  }
};

const eg3 = {
  xAxis: {
    categories: CATEGORIES
  },
  yAxis: {
    min: 0.2,
    max: 0.35,
    title: {
      text: 'CTR'
    }
  },
  series: [
    {
      name: 'CTR',
      type: 'bar',
      data: [0.252, 0.259, 0.253, 0.263, 0.264, 0.252, 0.259, 0.253, 0.263, 0.264],
      showInLegend: false,
      tooltip: {
        valueSuffix: '%'
      }
    }
  ],
  title: {
    text: 'CTR for Webmaker (Oct 1 – Nov 10 2015)'
  }
};

export default React.createClass({
  render: function() {
    return (<div>
      <main className="main">
        <div style={{maxWidth: 900, margin: '0 auto'}}>
          <Chart config={eg1} />
          <Chart config={eg2} />
          <Chart config={eg3} />
        </div>
      </main>
    </div>);
  }
});
