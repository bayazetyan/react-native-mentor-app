import {View, Button} from 'react-native-ui-lib';
import {StyleSheet, Animated} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from 'react-native-navigation-hooks';
import React, {useCallback, useEffect, useRef} from 'react';

// styles
import {colors} from 'src/styles/theme';
// constants
import {HEIGHT, WIDTH} from 'src/constants/device';
import {SCREEN_IDS} from 'src/constants/navigation';

const AnimatedGradientTransition =
  Animated.createAnimatedComponent(LinearGradient);

function GetStarted(): JSX.Element {
  const buttonPosition = useRef(new Animated.Value(HEIGHT)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const {setStackRoot} = useNavigation();

  useEffect(() => {
    Animated.parallel([
      Animated.spring(buttonPosition, {
        toValue: HEIGHT - 100,
        delay: 800,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const animationStyles = {
    transform: [{translateY: buttonPosition}],
  };

  const navigateToOnBoardingScreen = useCallback(async () => {
    await setStackRoot(SCREEN_IDS.on_boarding);
  }, []);

  return (
    <AnimatedGradientTransition
      useAngle
      angle={275}
      locations={[0, 1]}
      colors={[colors.brandColor1, colors.brandColor2]}
      style={[styles.linearGradient]}>
      <View flex centerH centerV>
        <Animated.Image
          resizeMode="contain"
          style={[styles.appLogo, {opacity}]}
          source={require('src/assets/images/mentorX_white.png')}
        />
      </View>
      <Animated.View style={[styles.buttonContainer, animationStyles]}>
        <Button
          label="Get Started"
          style={styles.button}
          labelStyle={styles.label}
          onPress={navigateToOnBoardingScreen}
        />
      </Animated.View>
    </AnimatedGradientTransition>
  );
}

const styles = StyleSheet.create({
  appLogo: {
    width: 240,
    height: 128,
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
  },
  button: {
    height: 60,
    width: '100%',
    backgroundColor: colors.white,
    shadowColor: colors.black1,
    shadowOpacity: 0.3,
    shadowRadius: 22,
    shadowOffset: {
      height: 10,
      width: 0,
    },
  },
  label: {
    fontWeight: '700',
    color: colors.brandColor1,
  },
  buttonContainer: {
    width: WIDTH,
    paddingHorizontal: 30,
    alignItems: 'center',
    position: 'absolute',
  },
});

GetStarted.options = {
  topBar: {
    visible: false,
  },
  layout: {
    componentBackgroundColor: colors.brandColor1,
  },
};

export default GetStarted;
