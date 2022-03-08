import type { DrawingContext } from "../DrawingContext";
import type { AnimatedProps } from "../processors";
import { materialize } from "../processors";
import { SkNode } from "../Host";

import type { DeclarationResult } from "./Declaration";

type Declare<P, D extends DeclarationResult> = (
  ctx: DrawingContext,
  props: P,
  node: SkiaNode<P, D>
) => D;

type Draw<P, D extends DeclarationResult> = (
  ctx: DrawingContext,
  props: P,
  node: SkiaNode<P, D>,
  decl: D
) => void;

export type SkiaNodeRenderer<P, D extends DeclarationResult> = {
  declare?: Declare<P, D>;
  draw?: Draw<P, D>;
};

export interface SkiaNodeProps<P, D extends DeclarationResult> {
  renderer: SkiaNodeRenderer<P, D>;
}

export class SkiaNode<P, D extends DeclarationResult = null> extends SkNode<P> {
  private readonly renderer: SkiaNodeRenderer<P, D>;

  declaration: D | undefined = undefined;

  constructor(props: AnimatedProps<P>, renderer: SkiaNodeRenderer<P, D>) {
    super(props);
    this.renderer = renderer;
  }

  set props(props: AnimatedProps<P>) {
    this.declaration = undefined;
    this._props = props;
  }

  get props() {
    return this._props;
  }

  declare(ctx: DrawingContext) {
    if (this.renderer.declare) {
      console.log("Declare Vertices");
      this.declaration = this.renderer.declare(
        ctx,
        materialize(this.props),
        this
      );
    }
    return this.declaration;
  }

  draw(ctx: DrawingContext) {
    const currentCtx = ctx;
    if (this.declaration === undefined) {
      this.declare(currentCtx);
    }
    if (this.renderer.draw) {
      this.renderer.draw(ctx, materialize(this.props), this, this.declaration!);
    }
  }
}
