import {combineReducers} from 'redux';
import {createRootReducer} from 'redux-exodus';

import AuthenticationReducer from './modules/authorization';
import NavigationReducer from './modules/navigation';
import GroupsReducer from './modules/groups';

const appReducer = combineReducers({
  authorization: AuthenticationReducer,
  navigation: NavigationReducer,
  groups: GroupsReducer,
});

export default createRootReducer(appReducer);
