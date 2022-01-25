import {FunctionComponent} from 'react';
import {
  LayoutStackChildren,
  Navigation,
  Options,
} from 'react-native-navigation';

// types
import {Screen, VoidFunc} from 'src/types/app';

// navigation helpers
import {getScreenStack} from './helpers';
import {appProvider} from './provider';
import {colors} from 'src/styles/theme';
import {AppState} from '../../types/redux';
import {Store} from 'redux';

export const initAppDefaultStyles = () => {
  Navigation.setDefaultOptions({
    overlay: {
      interceptTouchOutside: false
    },
    topBar: {
      scrollEdgeAppearance: {
        noBorder: true,
        active: true,
      },
      borderHeight: 0,
      elevation: 0,
      noBorder: true,
    },
    layout: {
      backgroundColor: colors.white,
      componentBackgroundColor: colors.white,
    },
    animations: {
      setRoot: {
        waitForRender: true,
      },
      setStackRoot: {
        waitForRender: true,
      },
      push: {
        waitForRender: true,
      },
    },
  });
};

export const registerComponents = (
  components: Screen[],
  store: Store<AppState>,
) => {
  if (components.length) {
    components.forEach(screen => {
      registerComponent(screen.id, screen.component, store);
    });
  }
};

export const registerComponent = (
  componentId: string,
  component: FunctionComponent,
  store: Store<AppState>,
) => {
  Navigation.registerComponent(
    componentId,
    () => appProvider(component, store),
    () => component,
  );
};

export const appLaunchedListener = (callback: VoidFunc): void => {
  Navigation.events().registerAppLaunchedListener(callback);
};

export const startApp = async (
  screen: string | LayoutStackChildren[],
  options: Options = {},
  props?: Record<string, unknown>,
): Promise<string> => {
  initAppDefaultStyles();
  return await Navigation.setRoot(getScreenStack(screen, options, props));
};
