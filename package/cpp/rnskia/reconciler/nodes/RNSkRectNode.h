#pragma once

#include <jsi/jsi.h>
#include <RNSkBaseNode.h>
#include <RNSkPropValue.h>
#include <RNSkPropMixins.h>

#include <JsiSkRect.h>

namespace RNSkia
{
  using namespace facebook;

  class RNSkRectNode : public RNSkBaseNode, RNSkRectProps
  {
  public:
    RNSkRectNode(jsi::Runtime &runtime,
                 const jsi::Value &props,
                 std::shared_ptr<RNSkPaintDeclaration> paintDeclaration) : RNSkBaseNode(paintDeclaration),
                                                                           RNSkRectProps(runtime, props) {}

    void render(jsi::Runtime &runtime, SkCanvas *canvas, const int w, const int h) override
    {
      if (x != nullptr && y != nullptr && width != nullptr && height != nullptr)
      {
        rect->setXYWH(x->getValue(runtime), y->getValue(runtime),
                      width->getValue(runtime), height->getValue(runtime));
      }
      SkPaint* paint = paintDeclaration->getObject().get();
      canvas->drawRect(*rect, *paint);
    }
  };
}
