import {FunctionComponent} from 'react';

export type VoidFunc = () => void

export interface Screen<T = any> {
  id: string;
  component: FunctionComponent<T>;
}

export interface ScreenProps {
  [key: string]: unknown;
  componentId: string;
}
