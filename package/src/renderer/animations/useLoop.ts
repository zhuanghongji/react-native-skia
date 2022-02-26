import { useEffect } from "react";

import { useValue } from "./useValue";
import { withTiming } from "./timing";
import type { Animation, AnimationCallback, AnimationState } from "./Scheduler";

interface RepeatAnimationState extends AnimationState {
  reps?: number;
}

export const withRepeat =
  (
    animation: Animation,
    numberOfReps = -1,
    reverse = false,
    callback?: AnimationCallback
  ): Animation<RepeatAnimationState> =>
  (timestamp, currentState) => {
    let state = animation(timestamp, currentState) as RepeatAnimationState;

    if (state.finished) {
      state.reps = state.reps ?? 1;
      state.reps++;
      state = animation(timestamp);
    }
    const reps = state.reps ?? 1;
    const finished = numberOfReps === -1 ? false : reps > numberOfReps;
    if (finished && callback) {
      callback(state.current);
    }
    return {
      ...state,
      finished,
    };
  };

export const useLoop = (duration: number) => {
  const progress = useValue(0);
  useEffect(() => {
    progress.setAnimation(withRepeat(withTiming({ duration: 3000 }), -1, true));
  }, [duration, progress]);
  return progress;
};
