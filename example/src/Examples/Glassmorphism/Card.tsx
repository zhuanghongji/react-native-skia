import {
  BackdropBlur,
  Canvas,
  rect,
  rrect,
  vec,
  useValue,
  useTouchHandler,
  Rect,
  LinearGradient,
  Paint,
  Text,
  Group,
  Fill,
} from "@shopify/react-native-skia";
import React from "react";
import { Dimensions } from "react-native";

import { Background } from "./components/Background";
import { Ball } from "./components/Ball";

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width - 64;
const CARD_HEIGHT = CARD_WIDTH * 0.61;
const clip = rrect(rect(0, 0, CARD_WIDTH, CARD_HEIGHT), 20, 20);

const x = (width - CARD_WIDTH) / 2;
const y = (height - CARD_HEIGHT) / 2;
export const Glassmorphism = () => {
  return (
    <Canvas style={{ flex: 1 }}>
      <Background />
      <Ball r={100} c={vec(75, 75)} />
      <Ball r={50} c={vec(width, height / 2)} />
      <Ball r={100} c={vec(150, height - 200)} />
      <Ball r={75} c={vec(300, height / 2 - 200)} />
      <Group
        clip={clip}
        transform={() => [{ translateY: y }, { translateX: x }]}
      >
        <Fill color="rgba(255, 255, 255, 0.5)" />
        <Paint>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(CARD_WIDTH, 0)}
            colors={["#5DA7D2ee", "#B848D9ee"]}
          />
        </Paint>
        <Rect x={0} y={CARD_HEIGHT - 70} width={CARD_WIDTH} height={70} />
        <Text
          text="SUPERBANK"
          x={20}
          y={40}
          familyName="source-sans-pro-semi-bold"
          size={24}
        />
        <Text
          x={20}
          y={110}
          text="1234 5678 1234 5678"
          familyName="source-sans-pro-semi-bold"
          size={24}
        />
        <Text
          text="VALID THRU"
          x={20}
          y={145}
          color="white"
          familyName="sans-serif-medium"
          size={10}
        />
        <Text
          text="12/29"
          x={20}
          y={160}
          color="white"
          size={12}
          familyName="sans-serif-medium"
        />
        <Text
          text="JOHN DOE"
          x={20}
          y={185}
          color="white"
          size={18}
          familyName="source-sans-pro-semi-bold"
        />
      </Group>
    </Canvas>
  );
};
