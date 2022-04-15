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
    canvas.drawTest(clock.current);
  });
  return <SkiaView ref={ref} style={{ flex: 1 }} onDraw={onDraw} debug />;
};
