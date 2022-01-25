import {createAction, createReducer} from 'redux-exodus';

const defaultState = {
  currentTabIndex: 0,
};

const updateTabIndexAction = createAction({
  key: 'currentTabIndex',
  name: 'UPDATE_TAB_INDEX',
});

export const actions = {
  updateTabIndex: updateTabIndexAction,
};

export default createReducer(actions, defaultState);
