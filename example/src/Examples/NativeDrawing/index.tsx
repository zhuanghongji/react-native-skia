import React from "react";
import {
  Canvas,
  Paint,
  Rect,
  useDerivedValue,
  useLoop,
} from "@shopify/react-native-skia";
import { processColor } from "react-native";

export const NativeDrawingExample: React.FC = () => {
  const progress = useLoop();
  const x = useDerivedValue(() => progress.current * 200, [progress]);
  const c = useDerivedValue(
    () =>
      processColor(
        `rgba(${127 + progress.current * 127}, ${progress.current * 255}, 0, 1)`
      ) as unknown as number,
    [progress]
  );
  return (
    <Canvas style={{ flex: 1 }} debug experimental>
      <Paint color={c} />
      {new Array(50).fill(0).map((_, index) => (
        <Rect key={index} x={x} y={25 + 4 * index} width={150} height={2} />
      ))}
    </Canvas>
  );
};
