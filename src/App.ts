import exodus from 'redux-exodus';

import {SCREENS} from 'src/screens';
import {COMPONENTS} from 'src/components/navigation';
import store from 'src/redux/store';

import {
  startApp,
  registerComponents,
  appLaunchedListener,
} from './services/navigation/core';

// Constants
import {COMPONENTS_IDS, SCREEN_IDS} from './constants/navigation';
import AsyncStorage from '@react-native-community/async-storage';
import {isAuth} from './services/firebase/api';
import {actions} from './redux/modules/authorization';
import {Navigation} from 'react-native-navigation';

// Register screens
registerComponents([...SCREENS, ...COMPONENTS], store);

// init exodus
exodus.init({
  store,
  storage: AsyncStorage,
});

export function main(): void {
  appLaunchedListener(async () => {
    const result = await isAuth();

    if (result) {
      await actions.getProfile(store.dispatch)();
      await startApp(SCREEN_IDS.dashboard);
      await Navigation.showOverlay({
        component: {
          id: COMPONENTS_IDS.bottom_tab_bar,
          name: COMPONENTS_IDS.bottom_tab_bar,
          options: {
            overlay: {
              interceptTouchOutside: false,
            },
            layout: {
              backgroundColor: 'transparent',
              componentBackgroundColor: 'transparent',
            },
          },
        },
      });
    } else {
      const isFirstStart = await AsyncStorage.getItem('firstStart');
      if (isFirstStart === null) {
        await AsyncStorage.setItem('firstStart', '1');
        await startApp(SCREEN_IDS.get_started);
      } else {
        await startApp(SCREEN_IDS.authorization);
      }
    }
  });
}
