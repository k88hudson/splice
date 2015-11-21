import {
  REQUEST_INIT,
  RECEIVE_INIT
} from 'actions/InitActions';

const initialState = {
  categories: [],
  channels: [],
  countries: [],
  locales: [],
  isFetching: false
};

export function Init(state = initialState, action = null) {
  switch (action.type) {
    case REQUEST_INIT:
      return Object.assign({}, state, {
        isFetching: true
      });
    case RECEIVE_INIT:
      return Object.assign({}, state, {
        categories: action.json.result.categories,
        channels: action.json.result.channels,
        countries: action.json.result.countries,
        locales: action.json.result.locales,
        isFetching: false
      });
    default:
      return state;
  }
}
