import React, { useEffect, useMemo, useRef } from "react";
import { Dimensions } from "react-native";
import {
  Skia,
  BlendMode,
  SkiaView,
  useDrawCallback,
  ValueApi,
  vec,
} from "@shopify/react-native-skia";

const size = 200;
const n = 39;

export const PerformanceDrawingTest = () => {
  const ref = useRef<SkiaView>(null);
  const clock = useMemo(() => ValueApi.createClockValue(), []);
  useEffect(() => {
    clock.start();
    return ref.current?.registerValues([clock]);
  }, [clock]);
  const onDraw = useDrawCallback((canvas) => {
    const c1 = Skia.Paint();
    c1.setColor(0xff000000);
    const c2 = Skia.Paint();
    c2.setColor(0xffffffff);
    canvas.save();
    canvas.rotate((360 * clock.current) / 4000, size / 2, size / 2);
    [...Array(n * n)].forEach((_, i) => {
      canvas.drawRect(
        Skia.XYWHRect(
          ((i % n) * size) / n,
          (Math.floor(i / n) * size) / n,
          size / n,
          size / n
        ),
        i % 2 ? c1 : c2
      );
    });
    canvas.restore();
  });
  return <SkiaView ref={ref} style={{ flex: 1 }} onDraw={onDraw} debug />;
};
