import type { Animation } from "./AnimatedValue";

export const timing = (
  timestamp: number,
  duration: number,
  startTimestamp: number
) => {
  const progress = (timestamp - startTimestamp) / duration;
  return progress;
};

export const withTiming = (duration: number): Animation<number> => ({
  onStart: (lastTimestamp) => ({
    current: 0,
    finished: false,
    lastTimestamp,
  }),
  onFrame: (timestamp, state) => {
    const progress = timing(timestamp, duration, state.lastTimestamp);
    return {
      current: progress,
      finished: progress > 1,
      lastTimestamp: state.lastTimestamp,
    };
  },
});
