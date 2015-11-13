from tests.base import BaseTestCase

from flask import url_for, json
from nose.tools import assert_equal


class TestReportingAPI(BaseTestCase):

    def setUp(self):
        super(TestReportingAPI, self).setUp(load_stats=True)

    def helper_test_set(self, filters={}, status_code=200, base_url='api.reporting.stats', empty=False):
        group_by = filters.get('group_by')
        query = {'campaign_id': 1}
        query.update(filters)
        url = url_for(base_url, **query)
        print(url)

        result = self.client.get(url)
        assert_equal(result.status_code, status_code)

        resp = json.loads(result.data)

        if not empty:
            assert(len(resp['results']))
        else:
            assert_equal(len(resp['results']), 0)

        if group_by:
            for r in resp['results']:
                assert(r.get(group_by))

        return resp

    def test_reporting_stats(self):
        """Test reporting stats 200 response"""
        default_resp = self.helper_test_set()
        date_resp = self.helper_test_set(filters={'group_by': 'date'})
        assert_equal(default_resp, date_resp)

    def test_locale(self):
        """Test group by locale"""
        self.helper_test_set(filters={'group_by': 'locale'})
        self.helper_test_set(filters={'group_by': 'locale', 'country_code': 'US'})

    def test_country(self):
        """Test group by country_code"""
        self.helper_test_set(filters={'group_by': 'country_code'})
        self.helper_test_set(filters={'group_by': 'country_code', 'locale': 'en-US'})

    def test_category(self):
        """Test group by category"""
        self.helper_test_set(filters={'group_by': 'category'})
        self.helper_test_set(filters={'group_by': 'category', 'channel_id': 1})

    def test_reporting_stats_empty(self):
        """Test reporting stats empty response"""
        self.helper_test_set({'campaign_id': 1132321}, empty=True)
        self.helper_test_set({'campaign_id': 4}, empty=True)
