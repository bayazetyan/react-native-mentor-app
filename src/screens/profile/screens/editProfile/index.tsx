import React, {useCallback, useState} from 'react';
import {StyleSheet, Pressable, TouchableOpacity, Keyboard} from 'react-native';
import {useNavigation} from 'react-native-navigation-hooks';
import {colors} from 'src/styles/theme';
import {Text, View, Avatar, ActionSheet} from 'react-native-ui-lib';
import {COMPONENTS_IDS} from 'src/constants/navigation';
import {Navigation} from 'react-native-navigation';
import {Input} from 'src/components';
import {
  CameraOptions,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import { useActions, useSelector } from "redux-exodus";
import {AppState, TProfile} from 'src/types/redux';
import { test, uploadAvatar } from "../../../../services/firebase/api";

function EditProfile(): JSX.Element {
  const {getProfile} = useActions();
  const profile = useSelector<AppState, TProfile>(
    'authorization.profile.payload',
  );
  const {dismissModal} = useNavigation();

  const [showActionSheet, setShowActionSheet] = useState(false);

  const [avatar, setAvatar] = useState<string | undefined>(profile.avatar);
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);

  const hideModal = useCallback(async () => {
    dismissModal();
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
  }, [dismissModal]);

  const pickOption = useCallback(
    async (action: 'camera' | 'gallery' | 'cancel') => {
      async function selectImage(result: ImagePickerResponse) {
        const image = result?.assets && result?.assets[0];
        if (image?.uri) {
          setAvatar(image?.uri);
          await uploadAvatar(image?.uri);
          await getProfile();
        }
      }

      const options = {
        mediaType: 'photo',
        selectionLimit: 1,
        saveToPhotos: true,
      } as CameraOptions;

      switch (action) {
        case 'camera':
          await launchCamera(options, selectImage);
          break;
        case 'gallery':
          await launchImageLibrary(options, selectImage);
          break;
        default:
          setShowActionSheet(false);
      }
    },
    [],
  );

  return (
    <>
      <View flex useSafeArea>
        <View row spread paddingH-16 centerV left height={52}>
          <Pressable onPress={hideModal}>
            <Text text70>Close</Text>
          </Pressable>
          <Pressable onPress={hideModal}>
            <Text text70 color={colors.secondaryColor1}>
              Update
            </Text>
          </Pressable>
        </View>
        <View paddingH-30>
          <View centerH marginB-30>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                Keyboard.dismiss();
                setShowActionSheet(true);
              }}>
              <Avatar
                ribbonLabel={avatar ? 'Change' : 'Add'}
                animate
                size={80}
                source={{
                  uri:
                    avatar ||
                    'https://fn.zhirkiller.com/wp-content/uploads/2018/09/no-avatar.png',
                }}
              />
            </TouchableOpacity>
          </View>
          <Input
            autoFocus
            marginB-15
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
          <Input
            marginB-15
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>
        <ActionSheet
          message="Select image from gallery"
          title={'Choose avatar'}
          cancelButtonIndex={2}
          destructiveButtonIndex={2}
          options={[
            {label: 'Open Gallery', onPress: () => pickOption('gallery')},
            {label: 'Open Camera', onPress: () => pickOption('camera')},
            {label: 'Cancel', onPress: () => pickOption('cancel')},
          ]}
          visible={showActionSheet}
          useNativeIOS
          onDismiss={() => {
            setShowActionSheet(false);
          }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  border: {
    paddingLeft: 17,
    borderColor: colors.border_color,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default EditProfile;
