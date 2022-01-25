// Screens

// Authorization
import Authorization from './authorization';
import Registration from './registration';

// Get started
import GetStarted from './getStarted';
import OnBoarding from './getStarted/screens/onBoarding';

import Dashboard from './dashboard';
import Profile from './profile';
import EditProfile from './profile/screens/editProfile';
import CreateGroup from './createGroup';
import Groups from './groups';

import {Screen} from 'src/types/app';
import {SCREEN_IDS} from 'src/constants/navigation';

export const SCREENS: Screen[] = [
  /* Authorization screens */
  {id: SCREEN_IDS.authorization, component: Authorization},
  {id: SCREEN_IDS.registration, component: Registration},
  /* Authorization screens */

  /* Get started screens */
  {id: SCREEN_IDS.get_started, component: GetStarted},
  {id: SCREEN_IDS.on_boarding, component: OnBoarding},
  /* Get started screens */

  {id: SCREEN_IDS.profile, component: Profile},
  {id: SCREEN_IDS.edit_profile, component: EditProfile},
  {id: SCREEN_IDS.dashboard, component: Dashboard},
  {id: SCREEN_IDS.create_group, component: CreateGroup},
  {id: SCREEN_IDS.groups, component: Groups},
];
