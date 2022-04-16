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
    const cmds = [
      { cmd: "var", name: "c1", type: "SkPaint" },
      { cmd: "method", var: "c1", method: "c1", args: [0xff000000] },
      { cmd: "var", name: "c2", type: "SkPaint" },
      { cmd: "method", var: "c2", method: "c2", args: [0xffffffff] },
      { cmd: "method", var: "canvas", method: "save" },
      {
        cmd: "method",
        var: "canvas",
        method: "rotate",
        args: [(360 * clock.current) / 4000, size / 2, size / 2],
      },
      {
        cmd: "method",
        var: "canvas",
        method: "drawCircle",
        args: [size / 2, size / 2, size / 2, "c1"],
      },
      {
        cmd: "method",
        var: "canvas",
        method: "restore",
      },
    ];
  });
  return <SkiaView ref={ref} style={{ flex: 1 }} onDraw={onDraw} debug />;
};
