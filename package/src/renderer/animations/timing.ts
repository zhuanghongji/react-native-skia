import type { Animation } from "./Scheduler";

export const timing = (
  timestamp: number,
  duration: number,
  startTimestamp: number
) => {
  const progress = (timestamp - startTimestamp) / duration;
  return progress;
};

export const withTiming =
  (duration: number): Animation<number> =>
  (timestamp, state) => {
    if (!state) {
      return {
        current: 0,
        finished: false,
        lastTimestamp: timestamp,
      };
    }
    const progress = timing(timestamp, duration, state.lastTimestamp);
    return {
      current: progress,
      finished: progress > 1,
      lastTimestamp: state.lastTimestamp,
    };
  };
