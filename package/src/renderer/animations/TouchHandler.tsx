import React, { useEffect } from "react";
import type { ReactNode } from "react";

import { useSkia } from "..";
import type { TouchHandler as TouchHandlerCallback } from "../../views";

interface TouchHandlerProps {
  children: ReactNode | ReactNode[];
  onTouch: TouchHandlerCallback;
}

export const TouchHandler = ({ children, onTouch }: TouchHandlerProps) => {
  const skia = useSkia();
  useEffect(() => {
    skia.onTouch = onTouch;
  }, [onTouch, skia]);
  return <>{children}</>;
};
