import {Store} from 'redux';
import {Provider} from 'react-redux';
import React, {FunctionComponent} from 'react';
import {NavigationProvider} from 'react-native-navigation-hooks';

// types
import {AppState} from 'src/types/redux';
import {ScreenProps} from 'src/types/app';

export const appProvider = (
  Component: FunctionComponent<ScreenProps>,
  store: Store<AppState>,
) => {
  return (props: ScreenProps) => {
    return (
      <Provider store={store}>
        <NavigationProvider value={{componentId: props.componentId}}>
          <Component {...props} />
        </NavigationProvider>
      </Provider>
    );
  };
};
