export const SCREEN_IDS = {
  groups: 'groups_screen',
  profile: 'profile_screen',
  dashboard: 'dashboard_screen',
  get_started: 'get_started_screen',
  on_boarding: 'on_boarding_screen',
  create_group: 'create_group_screen',
  edit_profile: 'edit_profile_screen',
  registration: 'registration_screen',
  authorization: 'authorization_screen',
};

export const COMPONENTS_IDS = {
  bottom_tab_bar: 'bottom_tab_bar_component',
};

export type TabBarData = {
  index: number;
  screen: string;
  icon?: string;
  activeIcon?: string;
};

export const tabBar: TabBarData[] = [
  {
    index: 0,
    screen: SCREEN_IDS.dashboard,
    icon: require('src/assets/icons/Home.png'),
    activeIcon: require('src/assets/icons/Home-Active.png'),
  },
  {
    index: 1,
    screen: SCREEN_IDS.groups,
    icon: require('src/assets/icons/Activity.png'),
    activeIcon: require('src/assets/icons/Activity-Active.png'),
  },
  {
    index: 4,
    screen: SCREEN_IDS.create_group,
  },
  {
    index: 2,
    screen: SCREEN_IDS.dashboard,
    icon: require('src/assets/icons/Camera.png'),
    activeIcon: require('src/assets/icons/Camera-Active.png'),
  },
  {
    index: 3,
    screen: SCREEN_IDS.profile,
    icon: require('src/assets/icons/Profile.png'),
    activeIcon: require('src/assets/icons/Profile-Active.png'),
  },
];
