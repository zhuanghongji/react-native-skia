#pragma once

#include <jsi/jsi.h>
#include <RNSkBaseDeclaration.h>
#include <RNSkPropMixins.h>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdocumentation"

#include <SkPaint.h>

#pragma clang diagnostic pop

namespace RNSkia
{
using namespace facebook;

class RNSkPaintDeclaration: public RNSkBaseDeclarationHolder<SkPaint>, RNSkPaintProps {
public:
  RNSkPaintDeclaration(jsi::Runtime& runtime, const jsi::Value& props):
    RNSkBaseDeclarationHolder(),
    RNSkPaintProps(runtime, props) {
      // Antialiasing is set to true by default
      getObject().setAntiAlias(true);
    }
  
  void update(jsi::Runtime &runtime) override {
    if(color != nullptr)
      getObject().setColor(color->getValue(runtime));
    
    if(strokeWidth != nullptr)
      getObject().setStrokeWidth(strokeWidth->getValue(runtime));
  }
};
}
