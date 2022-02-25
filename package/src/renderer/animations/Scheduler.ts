import type { RefObject } from "react";

import type { SkiaView } from "../../views/SkiaView";

type AnimationState<T> = {
  current: T;
  finished: boolean;
};

export type Animation<T> = (
  timestamp: number,
  state?: AnimationState<T>
) => AnimationState<T>;

export class Value<T> {
  value: T;
  engine: AnimationEngine;
  _animation: Animation<T> | null = null;
  state: AnimationState<T> | null = null;

  constructor(engine: AnimationEngine, value: T) {
    this.value = value;
    this.engine = engine;
  }

  get animation() {
    return this.animation;
  }

  set animation(animation: Animation<T>) {
    this._animation = animation;
    this.engine.addAnimation(this as Value<unknown>);
  }
}

export class AnimationEngine {
  private ref: RefObject<SkiaView>;
  private values: Value<unknown>[] = [];
  private _animations: Value<unknown>[] = [];

  constructor(ref: RefObject<SkiaView>) {
    this.ref = ref;
  }

  createValue(value: unknown) {
    const val = new Value(this, value);
    this.values.push(val);
    return val;
  }

  addAnimation(value: Value<unknown>) {
    this._animations.push(value);
  }

  run() {
    let dirty = false;
    const timestamp = Date.now();
    this._animations.forEach((value, i) => {
      const { animation, state } = value;
      const newState = animation(timestamp, state!);
      this._animations[i].state = newState;
      value.value = newState.current;
      if (value.value !== newState.current) {
        dirty = true;
      }
      if (state!.finished) {
        this._animations.splice(i, 1);
      }
    });
    if (dirty) {
      this.ref.current!.redraw();
    }
  }
}
