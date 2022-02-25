import { useEffect } from "react";

import { useValue } from "./useValue";
import { withTiming } from "./timing";
import type { Animation } from "./Scheduler";

export const withRepeat =
  (animation: Animation<number>): Animation<number> =>
  (timestamp, currentState) => {
    let state = animation(timestamp, currentState);
    if (state.finished) {
      state = animation(timestamp);
    }
    return {
      ...state,
      finished: false,
    };
  };

export const useLoop = (duration: number) => {
  const progress = useValue(0);
  useEffect(() => {
    progress.animation = withRepeat(withTiming(duration));
  }, []);
  return progress;
};
