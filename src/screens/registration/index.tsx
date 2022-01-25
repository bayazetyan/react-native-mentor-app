import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  AppState,
  FlatList,
  Keyboard,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  Asset,
  CameraOptions,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {useActions, useSelector} from 'redux-exodus';
import {useNavigation} from 'react-native-navigation-hooks';

import {
  ListItem,
  Text,
  View,
  Avatar,
  Wizard,
  ActionSheet,
} from 'react-native-ui-lib';
import {Input, Button} from 'src/components';

import {colors} from 'src/styles/theme';

import {IS_ANDROID} from 'src/constants/device';
import {COMPONENTS_IDS, SCREEN_IDS} from 'src/constants/navigation';

import {Employee, RegistrationForm} from 'src/types/redux';

import {useKeyboard} from 'src/hooks/useKeyboard';

// mock data
import users from 'src/assets/data/users.json';
import {
  createGroup,
  createUserInfo,
  signUp,
  uploadAvatar,
} from 'src/services/firebase/api';
import {Navigation} from 'react-native-navigation';
import {startApp} from 'src/services/navigation/core';

function Registration(): JSX.Element {
  // redux
  const {updateRegistrationForm, getProfile} = useActions();
  const registrationForm = useSelector<AppState, RegistrationForm>(
    'authorization.registrationForm.payload',
  );

  //  state
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hideButtons, setHideButtons] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [avatar, setAvatar] = useState<Asset | undefined>(undefined);

  const [completedStepIndex, setCompletedStepIndex] = useState<
    number | undefined
  >(undefined);

  const {setStackRoot} = useNavigation();

  useEffect(() => {
    return () => {
      // clear registration form after unmount component
      updateRegistrationForm.restore();
    };
  }, []);

  useKeyboard(0, isShow => {
    if (!isShow) {
      setHideButtons(false);
    }
  });

  const stepValidation = useMemo(() => {
    let isValid = false;
    if (activeIndex === 0) {
      return (
        !!registrationForm.firstName &&
        !!registrationForm.lastName &&
        !!registrationForm.email &&
        !!registrationForm.password
      );
    } else if (activeIndex === 1) {
      return !!registrationForm.jobTitle && !!registrationForm.department;
    } else if (activeIndex === 2) {
      return (
        !!registrationForm.groupName && registrationForm.groupMembers.length > 0
      );
    }

    return isValid;
  }, [activeIndex, registrationForm]);

  const onActiveIndexChanged = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const getStepState = useCallback(
    (index: number) => {
      let state = Wizard.States.DISABLED;

      if (completedStepIndex && completedStepIndex > index - 1) {
        state = Wizard.States.COMPLETED;
      } else if (activeIndex === index || completedStepIndex === index - 1) {
        state = Wizard.States.ENABLED;
      }

      return state;
    },
    [activeIndex, completedStepIndex],
  );

  const pickOption = useCallback(
    async (action: 'camera' | 'gallery' | 'cancel') => {
      function selectImage(result: ImagePickerResponse) {
        const image = result?.assets && result?.assets[0];
        setAvatar(image);
        updateRegistrationForm({avatar: image?.uri});
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
    [updateRegistrationForm],
  );

  const submit = useCallback(async () => {
    const {password, groupMembers, groupName, avatar, ...userInfo} =
      registrationForm;
    try {
      setIsLoading(true);
      await signUp(registrationForm.email, password);
      await createUserInfo(userInfo);
      await createGroup(groupName, groupMembers);
      if (avatar) {
        await uploadAvatar(avatar);
      }
      // load User data to redux store
      await getProfile();
      setIsLoading(false);
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
      await startApp(SCREEN_IDS.dashboard);
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  }, [getProfile, registrationForm, setStackRoot]);

  const goToNextStep = useCallback(async () => {
    if (activeIndex === 2) {
      await submit();
      return;
    }

    setActiveIndex(activeIndex + 1);
    setCompletedStepIndex(activeIndex + 1);
  }, [activeIndex, submit]);

  const goToPrevStep = useCallback(async () => {
    if (activeIndex === 0) {
      await setStackRoot(SCREEN_IDS.authorization);
    } else {
      setActiveIndex(activeIndex - 1);
    }
  }, [activeIndex, setStackRoot]);

  const renderStep = useMemo(() => {
    const onFocus = () => {
      if (IS_ANDROID) {
        setHideButtons(true);
      }
    };

    const renderPersonalInfoForm = () => {
      return (
        <>
          <View centerH marginB-15>
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
                  uri: registrationForm.avatar
                    ? registrationForm.avatar
                    : 'https://fn.zhirkiller.com/wp-content/uploads/2018/09/no-avatar.png',
                }}
              />
            </TouchableOpacity>
          </View>
          <Input
            autoFocus
            marginB-15
            onFocus={onFocus}
            placeholder="First Name"
            value={registrationForm.firstName}
            onChangeText={(value: string) =>
              updateRegistrationForm({firstName: value})
            }
          />
          <Input
            marginB-15
            onFocus={onFocus}
            placeholder="Last Name"
            value={registrationForm.lastName}
            onChangeText={(value: string) =>
              updateRegistrationForm({lastName: value})
            }
          />
          <Input
            marginB-15
            onFocus={onFocus}
            placeholder="Email"
            keyboardType="email-address"
            value={registrationForm.email}
            onChangeText={(value: string) =>
              updateRegistrationForm({email: value})
            }
          />
          <Input
            marginB-15
            secureTextEntry
            onFocus={onFocus}
            placeholder="Password"
            value={registrationForm.password}
            onChangeText={(value: string) =>
              updateRegistrationForm({password: value})
            }
          />
        </>
      );
    };

    const renderEmploymentDetailsForm = () => {
      return (
        <View>
          <Input
            autoFocus
            marginB-15
            placeholder="Job title"
            value={registrationForm.jobTitle}
            onChangeText={(value: string) =>
              updateRegistrationForm({jobTitle: value})
            }
          />
          <Input
            marginB-15
            placeholder="Department"
            value={registrationForm.department}
            onChangeText={(value: string) =>
              updateRegistrationForm({department: value})
            }
          />
        </View>
      );
    };

    const renderUserInfo = ({item}: {item: Employee}) => {
      const isSelected = registrationForm.groupMembers.includes(item);
      const selectUser = (user: Employee) => {
        if (isSelected) {
          updateRegistrationForm({
            groupMembers: registrationForm.groupMembers.filter(
              i => i.email !== user.email,
            ),
          });
        } else {
          updateRegistrationForm({
            groupMembers: [...registrationForm.groupMembers, user],
          });
        }
      };

      const selectedStyle = isSelected
        ? {backgroundColor: colors.brandColor2}
        : undefined;

      return (
        <ListItem
          style={selectedStyle}
          onPress={() => {
            selectUser(item);
          }}>
          <ListItem.Part left>
            <Avatar
              animate
              size={45}
              source={{
                uri: item.avatar,
              }}
            />
          </ListItem.Part>
          <ListItem.Part middle column containerStyle={styles.border}>
            <ListItem.Part>
              <Text text70BO color={isSelected ? colors.white : colors.black1}>
                {item.first_name} {item.last_name}
              </Text>
            </ListItem.Part>
            <ListItem.Part>
              <Text text90 color={isSelected ? colors.white : colors.gray2}>
                {item.email}
              </Text>
            </ListItem.Part>
          </ListItem.Part>
        </ListItem>
      );
    };

    const renderCreateGroupForm = () => {
      return (
        <>
          <Input
            autoFocus
            marginB-15
            placeholder="Group name"
            value={registrationForm.groupName}
            onChangeText={(value: string) =>
              updateRegistrationForm({groupName: value})
            }
          />
          <Text text70M marginB-10>
            Tap to select users
          </Text>
          <FlatList
            data={users}
            style={{marginBottom: 24}}
            renderItem={renderUserInfo}
            keyExtractor={item => item.email}
            showsVerticalScrollIndicator={false}
          />
        </>
      );
    };

    switch (activeIndex) {
      case 1:
        return renderEmploymentDetailsForm();
      case 2:
        return renderCreateGroupForm();
      default:
        return renderPersonalInfoForm();
    }
  }, [registrationForm, avatar, activeIndex, updateRegistrationForm]);

  return (
    <>
      <View flex useSafeArea>
        <Wizard
          activeIndex={activeIndex}
          onActiveIndexChanged={onActiveIndexChanged}>
          <Wizard.Step state={getStepState(0)} label="Personal Information" />
          <Wizard.Step state={getStepState(1)} label="Employment details" />
          <Wizard.Step state={getStepState(2)} label="Create group" />
        </Wizard>
        <View flex paddingH-30 marginT-30>
          {renderStep}
        </View>
        {!hideButtons && (
          <View
            row
            bottom
            paddingH-30
            marginB-30
            style={styles.buttonsContainer}>
            <Button
              marginR-15
              onPress={goToPrevStep}
              labelColor={colors.white}
              bgColor={colors.brandColor1}
              label={activeIndex > 0 ? 'Prev' : 'Back'}
              style={styles.button}
            />
            <Button
              marginL-15
              style={styles.button}
              onPress={goToNextStep}
              labelColor={colors.white}
              disabled={!stepValidation}
              bgColor={stepValidation ? colors.brandColor1 : colors.gray1}
              label={activeIndex < 2 ? 'Next' : 'Submit'}
            />
          </View>
        )}

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
      {isLoading && (
        <View style={styles.indicator}>
          <ActivityIndicator size="large" color={colors.white} />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    width: 'auto',
  },
  container: {
    flex: 1,
  },
  border: {
    paddingLeft: 17,
    borderColor: colors.border_color,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  buttonsContainer: {},
  indicator: {
    zIndex: 1000,
    backgroundColor: 'rgba(0,0,0,0.5)',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
});

Registration.options = {
  topBar: {
    visible: false,
  },
};

export default Registration;
