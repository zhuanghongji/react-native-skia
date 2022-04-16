/* global performance */
import React, { useEffect, useMemo, useRef } from "react";
import {
  rect,
  Skia,
  SkiaView,
  useDrawCallback,
  ValueApi,
} from "@shopify/react-native-skia";
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const size = 200;
const n = 39;

const recorder = Skia.PictureRecorder();
const c = recorder.beginRecording(rect(0, 0, width, height));
[...Array(n * n)].forEach((_, i) => {
  const paint = Skia.Paint();
  paint.setColor(i % 2 ? 0xff000000 : 0xffffffff);
  c.drawRect(
    Skia.XYWHRect(
      ((i % n) * size) / n,
      (Math.floor(i / n) * size) / n,
      size / n,
      size / n
    ),
    paint
  );
});
const picture = recorder.finishRecordingAsPicture();

export const PerformanceDrawingTest = () => {
  const ref = useRef<SkiaView>(null);
  const clock = useMemo(() => ValueApi.createClockValue(), []);
  useEffect(() => {
    clock.start();
    return ref.current?.registerValues([clock]);
  }, [clock]);
  const onDraw = useDrawCallback((canvas) => {
    canvas.save();
    canvas.rotate((360 * clock.current) / 4000, size / 2, size / 2);
    const t0 = performance.now();
    canvas.drawPicture(picture);
    const t1 = performance.now();
    console.log(t1 - t0);
    canvas.restore();
  });
  return <SkiaView ref={ref} style={{ flex: 1 }} onDraw={onDraw} debug />;
};
