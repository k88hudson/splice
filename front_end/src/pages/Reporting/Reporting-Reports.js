
import React from 'react';

import {connect} from 'react-redux';
import moment from 'moment';
import {fetchCampaigns, fetchCampaign, campaignSetPast} from 'actions/Campaigns/CampaignActions';
import {fetchAccounts} from 'actions/Accounts/AccountActions';
import {fetchStats} from 'actions/Stats/StatsActions';

import Select from 'react-select';
import Table from 'components/Table/Table';
import CampaignSummary from './CampaignSummary';
import Chart from './ReportChart';

const FILTERS = ['campaign_id', 'start_date', 'end_date', 'adgroup_type', 'channel_id', 'country_code', 'locale'];
const DEFAULT_REPORT_SETTINGS = {
  account_id: null,
  campaign_id: null,
  group_by: 'date',
  period: 'date',
  start_date: null,
  end_date: null,

  // Optional filters
  adgroup_type: null,
  channel_id: null,
  country_code: null,
  locale: null
};

const GROUP_BY_OPTIONS = [
  {value: 'date', label: 'Date'},
  {value: 'category', label: 'Category'},
  {value: 'locale', label: 'Locale'},
  {value: 'country_code', label: 'Country'}
];

function currency(n) {
  const nString = n * 100 + '';
  return `$${nString.slice(0, -1)}.${nString.slice(-2)}`;
}

function numberWithCommas(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const BASE_FIELDS = [
  {
    label: 'Impressions',
    key: 'impressions',
    format: row => numberWithCommas(row.impressions),
    sum: (a, b) => a + b
  },
  {
    label: 'Clicks',
    key: 'clicks',
    format: row => numberWithCommas(row.clicks),
    sum: (a, b) => a + b
  },
  {
    label: 'CTR',
    key: 'ctr',
    raw: function(row) {
      return row.clicks / row.impressions;
    },
    format: function(row) {
      const ctr = row.clicks / row.impressions;
      const formatted = `${Math.round(ctr * 10000000) / 100000}%`;
      const percentage = (ctr * 1000 - 2) / 2;
      let level = 2;
      if (percentage < 0.25) level = 1;
      if (percentage > 0.75) level = 3;
      return <span className={'ctr ctr-' + level} >{formatted}</span>;
    },
    sum: (a, b) => {
      return a + b;
    }
  },
  {
    label: 'Pinned',
    key: 'pinned',
    format: row => numberWithCommas(row.pinned),
    sum: (a, b) => a + b
  },
  {
    label: 'Blocked',
    key: 'blocked',
    format: row => numberWithCommas(row.blocked),
    sum: (a, b) => a + b
  }
];

const GROUP_BY_FIELDS = {
  date: {
    label: 'Date',
    format: function(row) {
      return moment(row.date, 'YYYY-MM-DD').format('MMM DD');
    }
  },
  week: {
    label: 'Week',
    format: function(row) {
      return `Week ${row.week}`;
    }
  },
  month: {
    label: 'Month',
    format: function(row) {
      return moment(row.month, 'MM').format('MMMM');
    }
  },
  category: {label: 'Category'},
  locale: {label: 'Locale'},
  country_code: {label: 'Country'}
};

function queryParser(query) {
  if (!query) return {};
  const output = _.clone(query);
  Object.keys(output).forEach(key => {
    if (!output[key]) delete output[key];
    if (['showEditor', 'showAllFilters'].indexOf(key) !== -1) delete output[key];
    if (['account_id', 'campaign_id'].indexOf(key) !== -1) output[key] = +output[key];
  });
  return output;
}

function createFieldSet(groupBy) {
  if (!GROUP_BY_FIELDS[groupBy]) return null;
  const fields = [];
  const groupByField = _.clone(GROUP_BY_FIELDS[groupBy]);
  groupByField.key = groupBy;
  fields.push(groupByField);
  BASE_FIELDS.forEach(field => {
    fields.push(_.clone(field));
  });
  return fields;
}

function arrayToCSV(data) {
  if (!data || !data.length) return null;
  const headerString = 'data:text/csv;charset=utf-8,';
  const head = Object.keys(data[0]).join(',') + '\n';
  const body = data.map(info => {
    return Object.keys(info).map(key => info[key]).join(',');
  }).join('\n');

  return headerString + encodeURI(head + body);
}

const ReportingReports = React.createClass({

  getInitialState: function() {
    return _.assign({}, DEFAULT_REPORT_SETTINGS, {
      showEditor: true,
      showAllFilters: false
    });
  },

  componentWillMount: function() {
    this.props.dispatch(campaignSetPast(true));
    this.props.dispatch(fetchAccounts());
    const query = queryParser(this.props.location.query);
    if (query.account_id) {
      this.props.dispatch(fetchCampaigns(query.account_id));
      this.setState(_.assign({}, query, {showEditor: false}));
      this.generateReport(query);
    }
  },

  componentWillUpdate: function(prevProps) {
    if (this.props.Stat.rows !== prevProps.Stat.rows &&
        !_.isEqual(queryParser(this.props.location.query), this.state)) {
      this.props.history.pushState(
        this.props.location.state,
        this.props.location.pathname,
        queryParser(this.state)
      );
    }
  },

  onSelectAccount: function(accountId) {
    if (accountId) this.props.dispatch(fetchCampaigns(accountId));
    this.setState({account_id: accountId, campaign_id: null});
  },

  onSelectCampaign: function(campaignId) {
    if (!campaignId) return this.setState({campaign_id: null});
    const {start_date, end_date} = campaignId ? this.campaignById(campaignId) : null;
    this.setState({
      campaign_id: campaignId,
      start_date: moment(start_date, 'YYYY-MM-DD').format('YYYY-MM-DD'),
      end_date: moment(end_date, 'YYYY-MM-DD').format('YYYY-MM-DD')
    });
  },

  render: function() {
    const reportSettings = this.state;
    const currentCampaign = this.props.Campaign.details;
    const stats = this.props.Stat.rows || [];
    const fields = this.fields();

    return (<div>
      <aside className={'sidebar' + (this.state.showEditor ? '' : ' collapsed')}>
        <div className="report-settings">
          <section>
            <div className="form-group">
              <label>Account</label>
              {this.props.Account.rows.length && <Select
                value={reportSettings.account_id}
                options={this.props.Account.rows.map(a => { return {value: a.id, label: a.name}; })}
                onChange={this.onSelectAccount} />}
            </div>
            <div className="form-group" hidden={!reportSettings.account_id || !this.props.Campaign.rows.length}>
              <label>Campaign</label>
              {this.props.Campaign.rows.length && <Select
                value={this.props.Campaign.rows ? reportSettings.campaign_id : ''}
                options={this.props.Campaign.rows.map(c => { return {value: c.id, label: c.name}; })}
                onChange={this.onSelectCampaign} />}
            </div>
          </section>
          <div hidden={!this.state.campaign_id}>
            <section className="flex-wrapper">
              <div className="form-group half">
                <label>Start Date</label>
                <input className="Input" value={reportSettings.start_date}
                  onChange={(e) => this.setState({start_date: e.target.value})} />
              </div>
              <div className="form-group half">
                <label>End Date</label>
                <input className="Input" value={reportSettings.end_date}
                  onChange={(e) => this.setState({end_date: e.target.value})} />
              </div>
            </section>
            <section>
              <div className="form-group">
                <label>Group By</label>
                <Select
                  value={reportSettings.group_by}
                  options={GROUP_BY_OPTIONS}
                  onChange={(value) => this.setState({group_by: value})} />
                <div className="Select" hidden={reportSettings.group_by !== 'date'}>
                  <Select
                    value={reportSettings.period}
                    options={[
                      {value: 'date', label: 'Daily'},
                      {value: 'week',  label: 'Weekly'},
                      {value: 'month', label: 'Monthly'}
                    ]}
                    onChange={(value) => this.setState({period: value})} />
                  </div>
              </div>
            </section>
            <section className="extra" hidden={!this.showAllFilters()}>
              <div className="form-group">
                <label>Type</label>
                <Select
                  value={reportSettings.adgroup_type}
                  options={[
                    {value: null, label: 'All'},
                    {value: 'directory', label: 'Directory'},
                    {value: 'suggested', label: 'Suggested'}
                  ]}
                  placeholder="All"
                  onChange={(value) => this.setState({adgroup_type: value})} />
              </div>
              <div className="form-group">
                <label>Channel</label>
                <Select
                  value={reportSettings.channel_id}
                  options={[{value: null, label: 'All'}].concat(this.props.Init.channels.map(c => {
                    return {value: c.id, label: c.name};
                  }))}
                  placeholder="All"
                  onChange={(value) => this.setState({channel_id: value})} />
              </div>
              <div className="form-group">
                <label>Locale</label>
                <Select
                  value={reportSettings.locale}
                  options={[{value: null, label: 'All'}].concat(this.props.Init.locales.map(l => {
                    return {value: l, label: l};
                  }))}
                  placeholder="All"
                  onChange={(value) => this.setState({locale: value})} />
              </div>
              <div className="form-group">
                <label>Country</label>
                <Select
                  value={reportSettings.country_code}
                  options={[{value: null, label: 'All'}].concat(this.props.Init.countries.map(c => {
                    return {value: c.country_code, label: c.country_name};
                  }))}
                  placeholder="All"
                  onChange={(value) => this.setState({country_code: value})} />
              </div>
              <div className="form-group">
                <button className="btn btn-default btn-emphasis"
                  onClick={() => this.setState({
                    showAllFilters: false, channel_id: null, adgroup_type: null
                  })}>
                  Clear extra filters
                </button>
              </div>
            </section>
            <section hidden={this.showAllFilters()}>
              <button className="btn btn-default btn-emphasis"
                onClick={() => this.setState({showAllFilters: true})}>
              <span className="icon ion-ios-settings-strong" /> Show more fitlers
              </button>
            </section>
            <section>
              <button onClick={() => this.generateReport(this.state)} className="btn btn-pink btn-emphasis">
                Generate Report
              </button>
            </section>
          </div>

        </div>
      </aside>
      <main className="main" hidden={!currentCampaign.id}>
        <h2> Report for {currentCampaign.name} by {this.props.Stat.query.group_by}
          <div className="pull-right">
            <button hidden={this.state.showEditor} className="btn btn-pink btn-emphasis"
              onClick={() => this.setState({showEditor: true})}>
              <span className="icon ion-edit" /> Edit report
            </button>
            <a className="btn btn-default btn-emphasis"
              href={arrayToCSV(stats)}
              download={'stats.csv'}>
              <span className="icon ion-document" /> Download as .csv
            </a>
          </div>
        </h2>
        <CampaignSummary campaign={currentCampaign} query={this.props.Stat.query} />
        {!!stats.length && false && <Chart
          categories={stats.map(row => row[this.props.Stat.query.group_by])}
          rows={stats} />}
        <Table fields={fields} data={stats} />
      </main>
    </div>);
  },

  fields: function() {
    return createFieldSet(this.props.Stat.query.group_by);
  },

  campaignById: function(id) {
    const campaigns = this.props.Campaign.rows;
    let result;
    campaigns.forEach(c => {
      if (+c.id === +id) result = c;
    });
    return result || {};
  },

  generateReport: function(rs) {
    const groupBy = rs.group_by === 'date' ? rs.period : rs.group_by;
    const query = {
      group_by: groupBy
    };
    FILTERS.forEach(f => {
      if (rs[f]) query[f] = rs[f];
    });
    this.props.dispatch(fetchStats(query));
    if (rs.campaign_id) this.props.dispatch(fetchCampaign(rs.campaign_id));
  },

  showAllFilters: function() {
    if (this.state.showAllFilters) return true;
    if (this.state.adgroup_type || this.state.channel_id) return true;
    return false;
  }

});

function select(state) {
  return {
    Account: state.Account,
    Campaign: state.Campaign,
    Init: state.Init,
    Stat: state.Stat
  };
}

// Wrap the component to inject dispatch and state into it
export default connect(select)(ReportingReports);
