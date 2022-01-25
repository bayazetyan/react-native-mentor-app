import {useActions} from 'redux-exodus';
import React, {useCallback, useState} from 'react';
import {Alert, StyleSheet} from 'react-native';
import {View, Text} from 'react-native-ui-lib';
// components
import {Input, Button} from 'src/components';

import {colors} from 'src/styles/theme';
import {useNavigation} from 'react-native-navigation-hooks';
import {COMPONENTS_IDS, SCREEN_IDS} from 'src/constants/navigation';
import {signIn} from 'src/services/firebase/api';
import {startApp} from 'src/services/navigation/core';
import { Navigation } from "react-native-navigation";

function Authorization(): JSX.Element {
  const {getProfile} = useActions();

  const {setStackRoot, showOverlay} = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigateToRegistration = useCallback(async () => {
    await setStackRoot(SCREEN_IDS.registration);
  }, [setStackRoot]);

  const submit = useCallback(async () => {
    try {
      const result = await signIn(email, password);
      if (result) {
        await getProfile();
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
      }
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  }, [email, getProfile, password, setStackRoot, showOverlay]);

  return (
    <View flex useSafeArea>
      <View centerH marginT-40>
        <Text marginB-5d text90L>
          Hey there,
        </Text>
        <Text text60>
          Welcome to Mentor<Text color={colors.secondaryColor1}>X</Text>
        </Text>
      </View>
      <View flex paddingH-30 marginT-30>
        <Input
          marginB-15
          value={email}
          placeholder="Email"
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Input
          secureTextEntry
          value={password}
          placeholder="Password"
          onChangeText={setPassword}
        />
      </View>
      <View paddingH-30 paddingB-40>
        <Button
          label="Login"
          onPress={submit}
          bgColor={colors.brandColor1}
          labelColor={colors.white}
        />
        <View row centerV marginT-30>
          <View flex height={1} backgroundColor={colors.gray3} />
          <Text marginH-10>Or</Text>
          <View flex height={1} backgroundColor={colors.gray3} />
        </View>
        <View centerH marginT-30>
          <Text>
            Don’t have an account yet?{' '}
            <Text
              color={colors.secondaryColor1}
              onPress={navigateToRegistration}>
              Register
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});

Authorization.options = {
  topBar: {
    visible: false,
  },
};

export default Authorization;
