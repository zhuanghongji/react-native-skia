import type { RefObject } from "react";

import type { SkiaView } from "../../views/SkiaView";

export type AnimationCallback = (v: number) => void;

export type AnimationState<T> = {
  current: T;
  finished: boolean;
};

export type Animation<T, S extends AnimationState<T> = AnimationState<T>> = (
  timestamp: number,
  state?: S
) => AnimationState<T>;

export class Value<T> {
  value: T;
  engine: Scheduler;
  private _animation: Animation<T> | null = null;
  state: AnimationState<T> | null = null;

  constructor(engine: Scheduler, value: T) {
    this.value = value;
    this.engine = engine;
  }

  get animation() {
    return this._animation;
  }

  setAnimation<S extends AnimationState<T>>(animation: Animation<T, S> | null) {
    if (animation === null) {
      this._animation = null;
      this.engine.removeAnimation(this as Value<unknown>);
    } else {
      this._animation = animation as Animation<T>;
      this.engine.addAnimation(this as Value<unknown>);
    }
  }
}

export class Scheduler {
  private ref: RefObject<SkiaView>;
  private animations: Value<unknown>[] = [];

  constructor(ref: RefObject<SkiaView>) {
    this.ref = ref;
  }

  createValue<T>(value: T) {
    return new Value(this, value);
  }

  addAnimation(value: Value<unknown>) {
    this.animations.push(value);
  }

  removeAnimation(value: Value<unknown>) {
    this.animations.splice(this.animations.indexOf(value), 1);
  }

  run() {
    let dirty = false;
    const timestamp = Date.now();
    this.animations.forEach((value, i) => {
      const { animation, state } = value;
      const newState = animation!(timestamp, state!);
      this.animations[i].state = newState;
      if (value.value !== newState.current) {
        dirty = true;
      }
      value.value = newState.current;
      value.state = newState;
      if (newState!.finished) {
        this.removeAnimation(value);
      }
    });
    if (dirty) {
      this.ref.current!.redraw();
    }
  }
}
