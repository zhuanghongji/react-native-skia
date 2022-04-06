import React from "react";
import {
  Canvas,
  Paint,
  Rect,
  useDerivedValue,
  useLoop,
} from "@shopify/react-native-skia";
import { processColor, Text, useWindowDimensions, View } from "react-native";

const NumberOfRects = 600;
const Size = 5;

export const NativeDrawingExample: React.FC = () => {
  const progress = useLoop();
  const x = useDerivedValue(() => -50 + progress.current * 100, [progress]);
  const c = useDerivedValue(
    () =>
      processColor(
        `rgba(${127 + progress.current * 127}, ${
          progress.current * 255
        }, 55, 1)`
      ) as unknown as number,
    [progress]
  );
  const { width } = useWindowDimensions();

  return (
    <View style={{ flex: 1 }}>
      <Text>{`  💯 🍔 Rendering ${NumberOfRects} rects:`}</Text>
      <Canvas style={{ flex: 1 }} debug experimental>
        <Paint color={c} />
        {new Array(NumberOfRects).fill(0).map((_, index) => (
          <Rect
            key={index}
            x={5 + ((index * Size) % width)}
            y={25 + Math.floor(index / (width / Size)) * Size}
            width={Size * 0.8}
            height={Size * 0.25}
          />
        ))}
      </Canvas>
    </View>
  );
};
