import { useEffect } from "react";

import { useValue } from "./useValue";
import { withTiming } from "./timing";
import type { Animation, AnimationState } from "./Scheduler";

export const withRepeat =
  (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    animation: Animation<number, any>
  ): Animation<number, AnimationState<number>> =>
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
    progress.setAnimation(withRepeat(withTiming(duration)));
  }, [duration, progress]);
  return progress;
};
