import React, {useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {Avatar, Text, View} from 'react-native-ui-lib';
import exodus, {useSelector} from 'redux-exodus';
import {AppState, TProfile} from 'src/types/redux';
import {colors} from 'src/styles/theme';
import {Button} from 'src/components';
import {
  useNavigation,
  useNavigationButtonPress,
} from 'react-native-navigation-hooks';
import {signOut} from 'src/services/firebase/api';
import {COMPONENTS_IDS, SCREEN_IDS} from 'src/constants/navigation';
import {Navigation} from 'react-native-navigation';

function Profile(): JSX.Element {
  const {showModal, setStackRoot} = useNavigation();

  const profile = useSelector<AppState, TProfile>(
    'authorization.profile.payload',
  );

  const navigateToEditProfileScreen = useCallback(async () => {
    await Navigation.dismissOverlay(COMPONENTS_IDS.bottom_tab_bar);
    await showModal(
      SCREEN_IDS.edit_profile,
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
  }, [showModal]);

  useNavigationButtonPress(async ({buttonId}) => {
    if (buttonId === 'signOut') {
      await signOut();
      await Navigation.dismissOverlay(COMPONENTS_IDS.bottom_tab_bar);
      await setStackRoot(
        SCREEN_IDS.authorization,
        {},
        {
          animations: {
            setStackRoot: {
              enabled: false,
            },
          },
        },
      );
      // clearStore
      exodus.resetStore([]);
    }
  });

  return (
    <View flex>
      <View centerV paddingH-30 marginT-35 row>
        <View>
          <Avatar source={{uri: profile.avatar}} />
        </View>
        <View flex marginL-12>
          <Text text70 numberOfLines={1}>
            {profile.firstName} {profile.lastName}
          </Text>
          <Text text90L color={colors.gray1} numberOfLines={1}>
            {profile.email}
          </Text>
        </View>
        <View marginL-12>
          <Button
            label="Edit"
            useShadow={false}
            style={styles.button}
            labelColor={colors.white}
            bgColor={colors.brandColor2}
            onPress={navigateToEditProfileScreen}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 'auto',
  },
});

Profile.options = {
  topBar: {
    rightButtons: [
      {
        id: 'signOut',
        fontSize: 17,
        text: 'Logout',
        fontWeight: '600',
        color: colors.secondaryColor2,
      },
    ],
    title: {
      text: 'Profile',
    },
  },
};

export default Profile;
