/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";

import { useValue } from "./useValue";
import { withTiming } from "./timing";
import type { Animation, AnimationState } from "./Scheduler";

export const withRepeat =
  (animation: Animation<any, any>): Animation<number, AnimationState<any>> =>
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
