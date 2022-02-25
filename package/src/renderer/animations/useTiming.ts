import { useEffect } from "react";

import { withTiming } from "./timing";
import { useValue } from "./useValue";

export const useTiming = (duration: number) => {
  const progress = useValue(0);
  useEffect(() => {
    progress.setAnimation(withTiming(duration));
  }, [duration, progress]);
  return progress;
};
