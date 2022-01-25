import React, {forwardRef} from 'react';
import {StyleSheet} from 'react-native';
import {Incubator} from 'react-native-ui-lib';
import {colors} from 'src/styles/theme';

import {TextInputProps} from 'react-native-ui-lib/typings';

interface InputProps extends TextInputProps {
  placeholder: string;
}

const Input = forwardRef((props: InputProps, ref): JSX.Element => {
  // @ts-ignore
  return <Incubator.TextField {...props} style={[styles.input]} ref={ref} />;
});

const styles = StyleSheet.create({
  input: {
    height: 48,
    fontSize: 14,
    borderRadius: 14,
    paddingHorizontal: 15,
    backgroundColor: colors.border_color,
  },
});

export default Input;
