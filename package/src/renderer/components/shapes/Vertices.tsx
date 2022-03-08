import React from "react";

import type { CustomPaintProps, SkEnum, AnimatedProps } from "../../processors";
import { enumKey } from "../../processors";
import type { SkPoint } from "../../../skia";
import { BlendMode, VertexMode, Skia, processColor } from "../../../skia";
import type { SkiaNodeRenderer } from "../../nodes/SkiaNode";
import type { SkVertices } from "../../../skia/Vertices/Vertices";

export interface VerticesProps extends CustomPaintProps {
  colors?: string[];
  vertices: SkPoint[];
  textures?: SkPoint[];
  mode: SkEnum<typeof VertexMode>;
  blendMode?: SkEnum<typeof BlendMode>;
  indices?: number[];
}

const renderer: SkiaNodeRenderer<VerticesProps, SkVertices> = {
  declare: ({ opacity }, { colors, vertices, textures, mode, indices }) => {
    const vertexMode = mode ? VertexMode[enumKey(mode)] : VertexMode.Triangles;
    return Skia.MakeVertices(
      vertexMode,
      vertices,
      textures,
      colors ? colors.map((c) => processColor(c, opacity)) : undefined,
      indices
    );
  },
  draw: ({ canvas, paint }, { colors, blendMode }, _, vertices) => {
    // If the colors are provided, the default blendMode is set to dstOver, if not, the default is set to srcOver
    const defaultBlendMode = colors ? BlendMode.DstOver : BlendMode.SrcOver;
    const blend = blendMode ? BlendMode[enumKey(blendMode)] : defaultBlendMode;
    canvas.drawVertices(vertices, blend, paint);
  },
};

export const Vertices = (props: AnimatedProps<VerticesProps>) => {
  return <skiaNode renderer={renderer} {...props} />;
};

Vertices.defaultProps = {
  mode: "triangles",
};
