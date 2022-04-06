// @flow strict-local

import type {ViewProps} from 'react-native/Libraries/Components/View/ViewPropTypes';
import type {HostComponent} from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type {
  Int32,
  WithDefault,
} from 'react-native/Libraries/Types/CodegenTypes';

type Mode =| "continuous" | "default";

type NativeProps = $ReadOnly<{|
  ...ViewProps,
  skiaId?: Int32,
  debug?: boolean,
  mode?: WithDefault<Mode, 'default'>,
|}>;

export default (codegenNativeComponent<NativeProps>(
   'ReactNativeSkiaView',
): HostComponent<NativeProps>);