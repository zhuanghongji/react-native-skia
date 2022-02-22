import { useMemo } from "react";

import { useSkia } from "../Canvas";

import { AnimatedValue } from "./AnimatedValue";

export const useValue = <T>(defaultValue: T) => {
  const skia = useSkia();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => new AnimatedValue(skia, defaultValue), []);
};
