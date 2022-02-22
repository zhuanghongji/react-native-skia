import { useEffect } from "react";

import { useValue } from "./useValue";

export const useTiming = (duration: number) => {
  const progress = useValue(0);
  useEffect(() => {
    progress.setAnimation({
      onStart: (lastTimestamp) => ({
        current: 0,
        finished: false,
        lastTimestamp,
      }),
      onFrame: (timestamp, state) => {
        const progress = (timestamp - state.lastTimestamp) / duration;
        console.log({ progress });

        return {
          current: progress,
          finished: progress > 1,
          lastTimestamp: state.lastTimestamp,
        };
      },
    });
  }, []);
  return progress;
};
