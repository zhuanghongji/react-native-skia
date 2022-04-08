import React, { useState } from "react";
import {
  Canvas,
  Paint,
  Rect,
  runTiming,
  useDerivedValue,
  useValue,
} from "@shopify/react-native-skia";
import {
  Button,
  processColor,
  StyleSheet,
  Switch,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

const Size = 10;

export const NativeDrawingExample: React.FC = () => {
  const progress = useValue(0);
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
  const [isDisabled, setIsDisabled] = useState(false);
  const [numberOfRects, setNumberOfRects] = useState(500);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.panel}>
        <View style={styles.row}>
          <Button
            disabled={isDisabled}
            title="⬇️"
            onPress={() => setNumberOfRects((n) => Math.max(0, n - 50))}
          />
          <Text>{`${numberOfRects} rects`}</Text>
          <Button
            disabled={isDisabled}
            title="⬆️"
            onPress={() => setNumberOfRects((n) => n + 50)}
          />
        </View>
        <View style={styles.row}>
          <Text>Experimental&nbsp;</Text>
          <Switch
            value={isExperimenal}
            disabled={isDisabled}
            onValueChange={() => setIsExperimental((p) => !p)}
          />
          <Button
            title="Run"
            disabled={isDisabled}
            onPress={() => {
              setIsDisabled(true);
              progress.current = 0;
              runTiming(progress, 1, { duration: 1000 }, () =>
                setIsDisabled(false)
              );
            }}
          />
        </View>
      </View>
      <Canvas
        style={{ flex: 1 }}
        debug
        mode={isDisabled ? "continuous" : undefined}
        experimental={isExperimenal}
      >
        <Paint color={c} />
        {new Array(numberOfRects).fill(0).map((_, index) => (
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
    padding: 10,
  },
});
