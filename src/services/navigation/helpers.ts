import {LayoutStackChildren, Options} from 'react-native-navigation';

export const getScreenStack = (
  screen: string | LayoutStackChildren[],
  options: Options = {},
  props?: Record<string, unknown>,
) => {
  if (typeof screen === 'string') {
    return {
      root: {
        stack: {
          id: 'screenStack',
          children: [
            {
              component: {
                id: screen,
                name: screen,
                options,
                passProps: props,
              },
            },
          ],
        },
      },
    };
  }
  return {
    root: {
      stack: {
        options,
        children: screen,
        passProps: props,
      },
    },
  };
};
