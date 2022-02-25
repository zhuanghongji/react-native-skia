import { useMemo, useEffect } from "react";

import { useSkia } from "../Canvas";

import { AnimationEngine, Value } from "./Scheduler";

export const useValue = <T>(defaultValue: T) => {
  const skia = useSkia();
  const engine = useMemo(() => new AnimationEngine(skia), []);
  useEffect(() => {
    const cb = () => {
      engine.run();
    };
    setInterval(() => cb(), 16);
  }, [engine]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => engine.createValue(defaultValue), []);
};
