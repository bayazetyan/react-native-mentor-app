import {Action, createStore, Store} from 'redux';
import {AppState} from 'src/types/redux';
import reducer from './reducer';

const store: Store<AppState, Action> = createStore(reducer);

export default store;
