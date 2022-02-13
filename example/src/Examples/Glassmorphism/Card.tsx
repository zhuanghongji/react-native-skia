import {
  BackdropBlur,
  Canvas,
  rect,
  rrect,
  vec,
  Group,
  useValue,
  useTouchHandler,
  Rect,
  LinearGradient,
  Paint,
} from "@shopify/react-native-skia";
import React from "react";
import { Dimensions } from "react-native";

import { Background } from "./components/Background";
import { Ball } from "./components/Ball";

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width - 64;
const CARD_HEIGHT = CARD_WIDTH * 0.61;
const clip = rrect(rect(0, 0, CARD_WIDTH, CARD_HEIGHT), 20, 20);

export const Glassmorphism = () => {
  const x = useValue((width - CARD_WIDTH) / 2);
  const y = useValue((height - CARD_HEIGHT) / 2);
  const offsetX = useValue(0);
  const offsetY = useValue(0);
  const onTouch = useTouchHandler({
    onStart: (pos) => {
      offsetX.value = pos.x - x.value;
      offsetY.value = pos.y - y.value;
    },
    onActive: (pos) => {
      x.value = offsetX.value + pos.x;
      y.value = offsetX.value + pos.y;
    },
  });
  return (
    <Canvas style={{ flex: 1 }} onTouch={onTouch}>
      <Background />
      <Ball r={100} c={vec(75, 75)} />
      <Ball r={50} c={vec(width, height / 2)} />
      <Ball r={100} c={vec(150, height - 200)} />
      <Ball r={75} c={vec(300, height / 2 - 200)} />
      <Group
        transform={() => [{ translateY: y.value }, { translateX: x.value }]}
      >
        <BackdropBlur
          clip={clip}
          intensity={15}
          color="rgba(255, 255, 255, 0.3)"
        />
        <Group clip={clip}>
          <Paint>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(CARD_WIDTH, 0)}
              colors={["#5DA7D2ee", "#B848D9ee"]}
            />
          </Paint>
          <Rect x={0} y={CARD_HEIGHT - 70} width={CARD_WIDTH} height={70} />
        </Group>
      </Group>
    </Canvas>
  );
};
