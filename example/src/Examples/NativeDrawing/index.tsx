import React, { useState } from "react";
import {
  Canvas,
  Paint,
  Rect,
  useDerivedValue,
  useLoop,
} from "@shopify/react-native-skia";
import {
  processColor,
  StyleSheet,
  Switch,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

const NumberOfRects = 1000;
const Size = 10;

export const NativeDrawingExample: React.FC = () => {
  const progress = useLoop();
  //const x = useDerivedValue(() => -50 + progress.current * 100, [progress]);
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

  const [isExperimenal, setIsExperimental] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.panel}>
        <Text>{`  💯 🍔 Rendering ${NumberOfRects} rects:`}</Text>
        <View style={styles.row}>
          <Text>Experimental&nbsp;</Text>
          <Switch
            value={isExperimenal}
            onValueChange={() => setIsExperimental((p) => !p)}
          />
        </View>
      </View>
      <Canvas style={{ flex: 1 }} debug experimental={isExperimenal}>
        <Paint color={c} />
        {new Array(NumberOfRects).fill(0).map((_, index) => (
          <Rect
            key={index}
            color={
              index % 2 === 0
                ? (processColor("red") as unknown as number)
                : undefined
            }
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

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  panel: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
