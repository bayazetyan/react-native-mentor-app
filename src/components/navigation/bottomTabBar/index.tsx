import React, {useMemo, useState} from 'react';
import {Image, Platform, Pressable, StyleSheet} from 'react-native';
import {View, Icon, Assets} from 'react-native-ui-lib';
import {colors} from 'src/styles/theme';
import {Navigation} from 'react-native-navigation';

import {useActions, useSelector} from 'redux-exodus';
import {tabBar} from 'src/constants/navigation';
import {useNavigation} from 'react-native-navigation-hooks';
import {AppState} from 'src/types/redux';
import {WIDTH} from 'src/constants/device';

function BottomTabBar(): JSX.Element {
  const {updateTabIndex} = useActions();
  const currentTabIndex = useSelector<AppState, number>(
    'navigation.currentTabIndex.payload',
  );

  const defaultContext = tabBar.find(i => i.index === currentTabIndex)?.screen;
  const [context, setContext] = useState<string>(defaultContext as string);

  const {showModal, dismissOverlay} = useNavigation();

  const renderTabBar = useMemo(() => {
    const navigateTabBar = async (index: number, screen: string) => {
      if (currentTabIndex !== index) {
        if (index === 4) {
          await dismissOverlay();
          await showModal(
            screen,
            {},
            {
              animations: {
                showModal: {
                  waitForRender: false,
                },
              },
              modal: {
                swipeToDismiss: false,
              },
            },
          );
        } else {
          updateTabIndex(index);
          setContext(screen);
          await Navigation.setStackRoot(context, [
            {
              component: {
                id: screen,
                name: screen,
                options: {
                  animations: {
                    setStackRoot: {
                      waitForRender: true,
                      enabled: false,
                    },
                  },
                },
              },
            },
          ]);
        }
      }
    };

    return (
      <View row flex spread>
        {tabBar.map(tab => {
          const isActive = currentTabIndex === tab.index;

          if (tab.index === 4) {
            return (
              <Pressable
                key={`tab_${tab.index}`}
                style={styles.createGroup}
                onPress={() => navigateTabBar(tab.index, tab.screen)}>
                <Icon
                  source={Assets.icons.plusSmall}
                  size={24}
                  tintColor={colors.white}
                />
              </Pressable>
            );
          }
          const tabIcon = isActive ? tab.activeIcon : tab.icon;
          return (
            <Pressable
              key={`tab_${tab.index}`}
              onPress={() => navigateTabBar(tab.index, tab.screen)}>
              <Image
                resizeMode="contain"
                style={styles.icon}
                source={tabIcon}
              />
            </Pressable>
          );
        })}
      </View>
    );
  }, [context, currentTabIndex, dismissOverlay, showModal, updateTabIndex]);

  return (
    <View style={styles.position}>
      <View height={80} style={[styles.container]}>
        {renderTabBar}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {},
  position: {
    bottom: 0,
    width: WIDTH,
    position: 'absolute',
  },
  createGroup: {
    width: 60,
    height: 60,
    bottom: 35,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brandColor2,

    shadowColor: colors.black1,
    shadowOpacity: 0.3,
    shadowRadius: 22,
    shadowOffset: {
      height: 10,
      width: 0,
    },
    ...Platform.select({
      android: {
        elevation: 1,
      },
    }),
  },
  container: {
    paddingTop: 20,
    paddingHorizontal: 30,
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: colors.black1,
        shadowOpacity: 0.1,
        shadowRadius: 40,
        shadowOffset: {
          height: 10,
          width: 0,
        },
      },
      android: {
        borderTopWidth: 1,
        borderTopColor: colors.border_color,
      },
    }),
  },
});

BottomTabBar.options = {
  layout: {
    componentBackgroundColor: 'transparent',
  },
};

export default BottomTabBar;
