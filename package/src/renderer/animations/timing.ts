import type { Animation, AnimationCallback, AnimationState } from "./Scheduler";

type EasingFunction = (t: number) => number;

interface TimingConfig {
  from?: number;
  to?: number;
  duration?: number;
  easing?: EasingFunction;
}

interface TimingState extends AnimationState {
  startValue: number;
  startTime: number;
}

export const timing = (
  now: number,
  config: Required<TimingConfig>,
  state: TimingState
) => {
  const { startTime, startValue } = state;
  const runtime = now - startTime;

  if (runtime >= config.duration) {
    // reset startTime to avoid reusing finished animation config in `start` method
    // state.startTime = 0;
    return config.to;
  }
  const progress = config.easing(runtime / config.duration);
  return startValue + (config.to - startValue) * progress;
};

export const withTiming =
  (
    userConfig?: TimingConfig,
    callback?: AnimationCallback
  ): Animation<TimingState> =>
  (timestamp, state?) => {
    const config = {
      from: 0,
      to: 1,
      duration: 300,
      easing: (t: number) => t,
      ...userConfig,
    };
    if (!state) {
      return {
        current: 0,
        finished: false,
        startValue: 0,
        startTime: timestamp,
      };
    }
    const progress = timing(timestamp, config, state);
    const finished = progress >= config.to;
    if (finished && callback) {
      callback(progress);
    }
    return {
      ...state,
      current: progress,
      finished,
    };
  };
