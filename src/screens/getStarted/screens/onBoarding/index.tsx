import {StyleSheet, Image} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import {useNavigation} from 'react-native-navigation-hooks';
import {Text, View, Carousel, Button} from 'react-native-ui-lib';
import {colors} from 'src/styles/theme';

// constants
import {onBoardingPages} from 'src/constants/common';
import {HEIGHT, WIDTH} from 'src/constants/device';
import {SCREEN_IDS} from 'src/constants/navigation';

function OnBoarding(): JSX.Element {
  const carousel = useRef<any>();
  const [currentIndex, seCurrentIndex] = useState(0);
  const {setStackRoot} = useNavigation();

  const renderCarouselPage = useCallback((item, index) => {
    return (
      <View flex key={`${index}_page`}>
        <View height={HEIGHT / 2}>
          <Image
            resizeMode="stretch"
            style={styles.image}
            source={item.image}
          />
        </View>
        <View marginT-64 paddingH-30>
          <Text text50 marginB-15>
            {item.title}
          </Text>
          <Text text70 color={colors.gray2}>
            {item.description}
          </Text>
        </View>
      </View>
    );
  }, []);

  const next = useCallback(async () => {
    if (currentIndex === 3) {
      await setStackRoot(SCREEN_IDS.authorization);
    } else {
      carousel.current.goToPage(currentIndex + 1, true);
    }
  }, [currentIndex]);

  return (
    <View flex backgroundColor={colors.white}>
      <Carousel
        key={4}
        ref={carousel}
        initialPage={0}
        itemSpacings={0}
        pageWidth={WIDTH}
        allowAccessibleLayout
        onChangePage={seCurrentIndex}
        containerStyle={{height: HEIGHT}}>
        {onBoardingPages.map(renderCarouselPage)}
      </Carousel>
      <View style={styles.buttonContainer}>
        <Button
          round
          iconS
          style={styles.button}
          size={Button.sizes.medium}
          onPress={next}
          backgroundColor={colors.brandColor1}
          iconStyle={{tintColor: colors.white}}
          iconSource={require('src/assets/icons/chevronRight.png')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    right: 30,
    bottom: 45,
  },
  button: {
    width: 50,
  },
});

OnBoarding.options = {
  topBar: {
    visible: false,
  },
};

export default OnBoarding;
