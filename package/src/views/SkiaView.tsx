import React from "react";
import { requireNativeComponent } from "react-native";

import type { SkImage, SkRect } from "../skia";
import type { SkiaReadonlyValue } from "../values";

import type {
  DrawMode,
  SkiaViewProps,
  RNSkiaDrawCallback,
  NativeSkiaViewProps,
} from "./types";

let SkiaViewNativeId = 1000;

const NativeSkiaView = requireNativeComponent<NativeSkiaViewProps>(
  "ReactNativeSkiaView"
);

declare global {
  var SkiaViewApi: {
    invalidateSkiaView: (nativeId: number) => void;
    makeImageSnapshot: (nativeId: number, rect?: SkRect) => SkImage;
    setDrawCallback: (
      nativeId: number,
      callback: RNSkiaDrawCallback | undefined
    ) => void;
    setDrawMode: (nativeId: number, mode: DrawMode) => void;
    registerValuesInView: (
      nativeId: number,
      values: SkiaReadonlyValue<unknown>[]
    ) => () => void;
  };
}

const { SkiaViewApi } = global;

export class SkiaView extends React.Component<SkiaViewProps> {
  constructor(props: SkiaViewProps) {
    super(props);
    this._skiaId = SkiaViewNativeId++;
    const { onDraw } = props;
    if (onDraw) {
      assertDrawCallbacksEnabled();
      SkiaViewApi.setDrawCallback(this._skiaId, onDraw);
    }
  }

  private _skiaId: number;

  public get nativeId() {
    return this._skiaId;
  }

  componentDidUpdate(prevProps: SkiaViewProps) {
    const { onDraw } = this.props;
    if (onDraw !== prevProps.onDraw) {
      assertDrawCallbacksEnabled();
      SkiaViewApi.setDrawCallback(this._skiaId, onDraw);
    }
  }

  /**
   * Creates a snapshot from the canvas in the surface
   * @param rect Rect to use as bounds. Optional.
   * @returns An Image object.
   */
  public makeImageSnapshot(rect?: SkRect) {
    assertDrawCallbacksEnabled();
    return SkiaViewApi.makeImageSnapshot(this._skiaId, rect);
  }

  /**
   * Sends a redraw request to the native SkiaView.
   */
  public redraw() {
    assertDrawCallbacksEnabled();
    SkiaViewApi.invalidateSkiaView(this._skiaId);
  }

  /**
   * Updates the drawing mode for the skia view. This is the same
   * as declaratively setting the mode property on the SkiaView.
   * There are two drawing modes, "continuous" and "default",
   * where the continuous mode will continuously redraw the view and
   * the default mode will only redraw when any of the regular react
   * properties are changed like size and margins.
   * @param mode Drawing mode to use.
   */
  public setDrawMode(mode: DrawMode) {
    assertDrawCallbacksEnabled();
    SkiaViewApi.setDrawMode(this._skiaId, mode);
  }

  /**
   * Registers one or move values as a dependant value of the Skia View. The view will
   * The view will redraw itself when any of the values change.
   * @param values Values to register
   */
  public registerValues(values: SkiaReadonlyValue<unknown>[]) {
    assertDrawCallbacksEnabled();
    return SkiaViewApi.registerValuesInView(this._skiaId, values);
  }

  render() {
    const { style, mode, debug = false } = this.props;
    return (
      <NativeSkiaView
        style={style}
        collapsable={false}
        skiaId={this._skiaId}
        mode={mode}
        debug={debug}
      />
    );
  }
}

const assertDrawCallbacksEnabled = () => {
  if (
    SkiaViewApi === null ||
    SkiaViewApi.setDrawCallback == null ||
    SkiaViewApi.invalidateSkiaView == null
  ) {
    throw Error("Skia Api is not enabled.");
  }
};
