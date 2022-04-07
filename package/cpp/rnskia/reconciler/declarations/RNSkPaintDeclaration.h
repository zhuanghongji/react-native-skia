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
    if(_parent != nullptr && (color != nullptr || strokeWidth != nullptr)) {
      // Copy parent before updating self. The reason for not keeping
      // a paint object around is that we want to get the values from
      // the current paint object *after* it was updated before rendering.      
      SkPaint* paint = new SkPaint(*_parent->getObject().get());
      setObject(*paint);
    }
    if(color != nullptr) {
      getObject()->setColor(color->getValue(runtime));
    }
    if(strokeWidth != nullptr) {
      getObject()->setStrokeWidth(strokeWidth->getValue(runtime));
    }    
  }
  
private:
  std::shared_ptr<RNSkPaintDeclaration> _parent;
};
}
