import {useEffect, useRef, useState} from 'react';
import {Animated, Keyboard, KeyboardEvent} from 'react-native';
import {IS_ANDROID, IS_IPHONE_X} from 'src/constants/device';

export const useKeyboard = (
  defaultValue = 0,
  callback?: (isShow: boolean) => void,
): [number, Animated.Value] => {
  const [keyboardHeight, setKeyboardHeight] = useState(defaultValue);
  const animatedHeight = useRef(new Animated.Value(defaultValue)).current;

  useEffect(() => {
    const eventShow = IS_ANDROID ? 'keyboardDidShow' : 'keyboardWillShow';
    const eventHide = IS_ANDROID ? 'keyboardDidHide' : 'keyboardWillHide';

    function animateHeight(value: number) {
      Animated.timing(animatedHeight, {
        toValue: value,
        duration: 250,
        useNativeDriver: false,
      }).start();
    }

    function onKeyboardDidShow(e: KeyboardEvent): void {
      const offset = IS_IPHONE_X ? 40 - defaultValue : 0;
      animateHeight(e.endCoordinates.height - offset);
      setKeyboardHeight(e.endCoordinates.height - offset);
      if (callback) {
        callback(true);
      }
    }

    function onKeyboardDidHide(): void {
      animateHeight(defaultValue);
      setKeyboardHeight(defaultValue);
      if (callback) {
        callback(false);
      }
    }

    Keyboard.addListener(eventShow, onKeyboardDidShow);
    Keyboard.addListener(eventHide, onKeyboardDidHide);
    return (): void => {
      Keyboard.removeAllListeners(eventShow);
    };
  }, []);

  return [keyboardHeight, animatedHeight];
};
