import {ActionState} from 'redux-exodus';

export interface AppState {
  authorization: AuthorizationState;
  navigation: NavigationState;
}

export interface AuthorizationState {
  registrationForm: ActionState<RegistrationForm>;
  profile: ActionState<TProfile>;
}
export interface NavigationState {
  currentTabIndex: ActionState<number>;
}

export type TProfile = {
  avatar: string;
  email: string;
  lastName: string;
  password: string;
  jobTitle: string;
  groupName: string;
  firstName: string;
  department: string;
};

export type Employee = {
  avatar: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  department: string;
  job_title: string;
  country: string;
  city: string;
};

export interface RegistrationForm {
  avatar: string;
  email: string;
  lastName: string;
  password: string;
  jobTitle: string;
  groupName: string;
  firstName: string;
  department: string;
  groupMembers: Employee[];
}
