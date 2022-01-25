import {createAction, createReducer} from 'redux-exodus';
import {getProfile} from 'src/services/firebase/api';

const defaultState = {
  profile: {},
  registrationForm: {
    avatar: '',
    email: '',
    lastName: '',
    password: '',
    jobTitle: '',
    groupName: '',
    firstName: '',
    department: '',
    groupMembers: '',
  },
};

const updateRegistrationFormAction = createAction({
  merge: () => true,
  key: 'registrationForm',
  name: 'UPDATE_REGISTRATION_FORM',
});

const getProfileAction = createAction({
  key: 'profile',
  apiCall: getProfile,
  name: 'GET_PROFILE',
  handleResponse: result => {
    return result.data();
  },
});

export const actions = {
  getProfile: getProfileAction,
  updateRegistrationForm: updateRegistrationFormAction,
};

export default createReducer(actions, defaultState);
