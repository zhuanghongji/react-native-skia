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

  set animation(animation: Animation<T> | null) {
    if (animation === null) {
      this._animation = null;
      this.engine.removeAnimation(this as Value<unknown>);
    } else {
      this._animation = animation;
      this.engine.addAnimation(this as Value<unknown>);
    }
  }
}

export class Scheduler {
  private ref: RefObject<SkiaView>;
  private _animations: Value<unknown>[] = [];

  constructor(ref: RefObject<SkiaView>) {
    this.ref = ref;
  }

  createValue<T>(value: T) {
    const val = new Value(this, value);
    return val;
  }

  addAnimation(value: Value<unknown>) {
    this._animations.push(value);
  }

  removeAnimation(value: Value<unknown>) {
    this._animations.splice(this._animations.indexOf(value), 1);
  }

  run() {
    let dirty = false;
    const timestamp = Date.now();
    this._animations.forEach((value, i) => {
      const { animation, state } = value;
      const newState = animation!(timestamp, state!);
      this._animations[i].state = newState;
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
