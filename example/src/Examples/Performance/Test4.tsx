import React, { useEffect, useMemo, useRef } from "react";
import {
  Skia,
  SkiaView,
  useDrawCallback,
  ValueApi,
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
    const t0 = performance.now();
    canvas.drawTest(clock.current);
    const t1 = performance.now();
    console.log(t1 - t0);
  });
  return <SkiaView ref={ref} style={{ flex: 1 }} onDraw={onDraw} debug />;
};
