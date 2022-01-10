import type { SkJSIInstance } from "../JsiInstance";

export interface FontMgr extends SkJSIInstance<"FontMgr"> {
  /**
   * Return the number of font families loaded in this manager. Useful for debugging.
   */
  countFamilies(): number;

  /**
   * Return the nth family name. Useful for debugging.
   * @param index
   */
  getFamilyName(index: number): string;
}
