import React from 'react';
import {Button as NativeButton, ButtonProps} from 'react-native-ui-lib';
import {StyleSheet} from 'react-native';
import {colors} from 'src/styles/theme';

type CustomButtonProps = ButtonProps & {
  bgColor?: string;
  labelColor?: string;
  useShadow?: boolean;
};

function Button(props: CustomButtonProps): JSX.Element {
  const {
    style,
    useShadow = true,
    bgColor = colors.white,
    labelColor = colors.brandColor1,
    ...otherProps
  } = props;
  return (
    <NativeButton
      style={[
        styles.button,
        {backgroundColor: bgColor},
        useShadow ? styles.shadow : undefined,
        style,
      ]}
      labelStyle={[styles.label, {color: labelColor}]}
      {...otherProps}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    height: 60,
    width: '100%',
  },
  shadow: {
    elevation: 1,
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
  },
});

export default Button;
