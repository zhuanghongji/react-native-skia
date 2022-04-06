#pragma once

#include <jsi/jsi.h>
#include <RNSkPropValue.h>
#include <JsiSkRect.h>

namespace RNSkia
{
    using namespace facebook;

class RNSkPropsMixin {
public:
  static jsi::Value getProperty(jsi::Runtime &runtime, const jsi::Value &value, const char* name) {
    if(value.isObject()) {
      auto props = value.asObject(runtime);
      auto prop = props.getProperty(runtime, name);
      return prop;
    }
    throw jsi::JSError(runtime, "Property descriptor is not an object.");
  }
  
  static bool hasProperty(jsi::Runtime &runtime, const jsi::Value &value, const char* name) {
    auto prop = getProperty(runtime, value, name);
    return !prop.isUndefined() && !prop.isNull();
  }
};

class RNSkRectProps: RNSkPropsMixin
{
public:
  RNSkRectProps(jsi::Runtime& runtime, const jsi::Value& props): RNSkPropsMixin() {
    // Check for rect property
    if(hasProperty(runtime, props, "rect")) {
      auto rectProp = std::make_unique<RNSkHostObjectPropValue<JsiSkRect>>(runtime, props, "rect");
      auto r = rectProp->getValue(runtime)->getObject();
      // Copy values from rect
      rect = std::make_unique<SkRect>(SkRect::MakeXYWH(r->x(), r->y(), r->width(), r->height()));
    } else {
      // Process rect from props instead
      x = std::make_unique<RNSkFloatPropValue>(runtime, props, "x");
      y = std::make_unique<RNSkFloatPropValue>(runtime, props, "y");
      width = std::make_unique<RNSkFloatPropValue>(runtime, props, "width");
      height = std::make_unique<RNSkFloatPropValue>(runtime, props, "height");
      // Make empty rect - it will be updated on each render
      rect = std::make_unique<SkRect>(SkRect::MakeEmpty());
    }
  }
  
protected:
  std::unique_ptr<RNSkFloatPropValue> x;
  std::unique_ptr<RNSkFloatPropValue> y;
  std::unique_ptr<RNSkFloatPropValue> width;
  std::unique_ptr<RNSkFloatPropValue> height;
  std::unique_ptr<SkRect> rect;
};

class RNSkPaintProps: RNSkPropsMixin
{
public:
  RNSkPaintProps(jsi::Runtime& runtime, const jsi::Value& props): RNSkPropsMixin() {
    // Check for rect property
    if(hasProperty(runtime, props, "color")) {
      color = std::make_unique<RNSkIntPropValue>(runtime, props, "color");
    }
    if(hasProperty(runtime, props, "strokeWidth")) {
      strokeWidth = std::make_unique<RNSkFloatPropValue>(runtime, props, "strokeWidth");
    }
  }
  
  static bool hasPaintProps(jsi::Runtime& runtime, const jsi::Value& props) {
    return hasProperty(runtime, props, "color") || hasProperty(runtime, props, "strokeWidth");
  }
  
protected:
  std::unique_ptr<RNSkIntPropValue> color;
  std::unique_ptr<RNSkFloatPropValue> strokeWidth;
};
}
