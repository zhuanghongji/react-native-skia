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
    RNSkBaseDeclarationHolder(std::make_shared<SkPaint>()),
    RNSkPaintProps(runtime, props),
    _parent(nullptr) {
      // Antialiasing is set to true by default
      getObject()->setAntiAlias(true);
    }
  
  RNSkPaintDeclaration(jsi::Runtime& runtime,
                       const jsi::Value& props,
                       std::shared_ptr<RNSkPaintDeclaration> parent):
    RNSkBaseDeclarationHolder(std::make_shared<SkPaint>()),
    RNSkPaintProps(runtime, props),
    _parent(parent) {
      // Antialiasing is set to true by default
      getObject()->setAntiAlias(true);
    }
  
  void update(jsi::Runtime &runtime) override {
    if(_parent != nullptr) {
      // Copy parent before updating self
      auto p = new SkPaint(*_parent->getObject().get());
      internalUpdate(runtime, *p);
      delete p;
    } else {
      internalUpdate(runtime, *getObject());
    }
  }
  
  void internalUpdate(jsi::Runtime &runtime, SkPaint &paint) {
    if(color != nullptr) {
      paint.setColor(color->getValue(runtime));
    }
    if(strokeWidth != nullptr) {
      paint.setStrokeWidth(strokeWidth->getValue(runtime));
    }
  }
  
private:
  std::shared_ptr<RNSkPaintDeclaration> _parent;
};
}
