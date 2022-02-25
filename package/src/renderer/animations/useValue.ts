import { useMemo } from "react";

import { useSkia } from "../Canvas";

export const useValue = <T>(defaultValue: T) => {
  const skia = useSkia();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => skia.scheduler.createValue(defaultValue), []);
};
