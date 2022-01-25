import {createAction, createReducer} from 'redux-exodus';
import {getGroups} from 'src/services/firebase/api';

const defaultState = {
  data: [],
};

const getGroupsAction = createAction({
  key: 'data',
  apiCall: getGroups,
  name: 'GET_GROUPS',
  handleResponse: result => {
    return result.docs.map(item => ({...item.data(), id: item.id}));
  },
});

export const actions = {
  getGroups: getGroupsAction,
};

export default createReducer(actions, defaultState);
