import type { RefObject } from "react";

import type { SkiaView } from "../../views/SkiaView";

export interface AnimationState<T> {
  current: T;
  finished: boolean;
}

export type Animation<T> = {
  onStart: (timestamp: number) => AnimationState<T>;
  onFrame: (timestamp: number, state: AnimationState<T>) => AnimationState<T>;
};

export class AnimatedValue<T> {
  private ref: RefObject<SkiaView>;
  private _value: T;
  private animation: Animation<T> | null = null;
  private animationState: AnimationState<T> | null = null;

  constructor(ref: RefObject<SkiaView>, value: T) {
    this.ref = ref;
    this._value = value;
  }

  get value() {
    if (this.animation) {
      this.animationState = this.animation.onFrame(
        Date.now(),
        this.animationState!
      );
      this._value = this.animationState.current;
      if (this.animationState.finished) {
        this.setAnimation(null);
      }
    }
    return this._value;
  }

  set value(value: T) {
    this._value = value;
    this.ref.current?.redraw(); // <- inversion on control: the view knows about its values.
  }

  setAnimation(animation: Animation<T> | null) {
    this.animation = animation;
    if (animation) {
      this.animationState = animation.onStart(Date.now());
    } else {
      this.animationState = null;
    }
  }
}
