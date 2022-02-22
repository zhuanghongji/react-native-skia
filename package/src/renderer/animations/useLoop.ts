import { useEffect } from "react";

import { useValue } from "./useValue";
import { withTiming } from "./timing";
import type { Animation } from "./AnimatedValue";

export const withRepeat = (
  animation: Animation<number>
): Animation<number> => ({
  onStart: (timestamp) => animation.onStart(timestamp),
  onFrame: (timestamp, currentState) => {
    let state = animation.onFrame(timestamp, currentState);
    if (state.finished) {
      state = animation.onStart(timestamp);
    }
    return {
      ...state,
      finished: false,
    };
  },
});

export const useLoop = (duration: number) => {
  const progress = useValue(0);
  useEffect(() => {
    progress.setAnimation(withRepeat(withTiming(duration)));
  }, []);
  return progress;
};
