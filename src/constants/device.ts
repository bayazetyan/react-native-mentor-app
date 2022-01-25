import {Dimensions, Platform} from 'react-native';

export const IS_IPHONE_X = isIphoneX();
export const IS_ANDROID = Platform.OS === 'android';
export const IS_IPHONE = Platform.OS === 'ios';

function isIphoneX() {
  const {height, width} = Dimensions.get('window');

  function isIPhoneXSize() {
    return height >= 812 || width >= 812;
  }

  function isIPhoneXrSize() {
    return height >= 896 || width >= 896;
  }

  return IS_IPHONE && (isIPhoneXSize() || isIPhoneXrSize());
}

export const WIDTH = Dimensions.get('window').width;
export const HEIGHT = Dimensions.get('window').height;
