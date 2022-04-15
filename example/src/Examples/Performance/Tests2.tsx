import React from "react";
import {
  Canvas,
  Group,
  Rect,
  Text,
  useClockValue,
  useDerivedValue,
} from "@shopify/react-native-skia";

const size = 200;
const n = 39;

export const PerformanceDrawingTest = () => {
  const clock = useClockValue();
  const transform = useDerivedValue(
    () => [{ rotate: (Math.PI * clock.current) / 4000 }],
    [clock]
  );
  return (
    <Canvas style={{ flex: 1, margin: 50 }} debug>
      <Group origin={{ x: size / 2, y: size / 2 }} transform={transform}>
        {[...Array(n * n)].map((_, i) => (
          <Rect
            key={i}
            x={((i % n) * size) / n}
            y={(Math.floor(i / n) * size) / n}
            width={size / n}
            height={size / n}
            color={i % 2 ? "#000" : "#ddd"}
          />
        ))}
      </Group>
      <Text
        x={20}
        y={size + 100}
        text={`n = ${n}`}
        familyName="serif"
        size={32}
      />
    </Canvas>
  );
};
