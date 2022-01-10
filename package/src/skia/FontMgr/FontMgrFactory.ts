import type { FontMgr } from "./FontMgr";

export interface FontMgrFactory {
  FromURIs(uri: string[]): Promise<FontMgr>;
}
