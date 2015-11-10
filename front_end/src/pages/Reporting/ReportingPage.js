import React from 'react';
import { connect } from 'react-redux';
import { pageVisit } from 'actions/App/AppActions';
import Nav from './ReportingNav';

const navItems = [
    // {link: '/reporting/dashboard', icon: 'stats-bars', label: 'Charts'},
    {link: '/reporting/reports', icon: 'document', label: 'Reports'}
    // {link: '/reporting/saved', icon: 'pin', label: 'Saved'}
];

const ReportingPage = React.createClass({

    componentDidMount: function() {
        const { dispatch } = this.props;
        pageVisit('Reporting', this);
    },

    render: function() {
        return (
            <div id="reporting">
                <aside className="sidebar icons">
                    <Nav items={navItems} />
                </aside>
                {this.props.children}
            </div>
        );
    }

});

function select(state) {
    return {};
}

export default connect(select)(ReportingPage);
