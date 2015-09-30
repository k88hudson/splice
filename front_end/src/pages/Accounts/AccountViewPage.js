import React, { Component } from 'react/addons';

import { connect } from 'react-redux';
import { Link } from 'react-router';

import { updateDocTitle, pageVisit } from 'actions/App/AppActions';
import { fetchHierarchy } from 'actions/App/BreadCrumbActions';

import AccountDetails from 'components/Accounts/AccountDetails/AccountDetails';
import CampaignList from 'components/Campaigns/CampaignList/CampaignList';

export default class AccountViewPage extends Component {
  componentWillMount() {
    this.fetchAccountDetails(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.accountId !== this.props.params.accountId) {
      this.fetchAccountDetails(nextProps);
    }
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-xs-6">
            <h1>Account</h1>
            <AccountDetails Account={this.props.Account}/>
          </div>
        </div>
        <br/>
        <p><Link className="btn btn-default" to={'/accounts/' + this.props.Account.details.id + '/createcampaign'}>Create Campaign <i className="fa fa-plus"></i></Link></p>
        <div><strong>Campaigns</strong></div>
        <CampaignList rows={this.props.Campaign.rows}
                      isFetching={this.props.Campaign.isFetching}/>
      </div>
    );
  }

  fetchAccountDetails(props) {
    const { dispatch } = props;

    updateDocTitle('Account View');

    dispatch(fetchHierarchy('account', props))
      .catch(function(){
        props.history.pushState(null, '/error404');
      })
    .then(() => {
      pageVisit('Account - ' + this.props.Account.details.name, this);
    });
  }
}

AccountViewPage.propTypes = {};

function select(state) {
  return {
    Account: state.Account,
    Campaign: state.Campaign
  };
}

// Wrap the component to inject dispatch and state into it
export default connect(select)(AccountViewPage);
