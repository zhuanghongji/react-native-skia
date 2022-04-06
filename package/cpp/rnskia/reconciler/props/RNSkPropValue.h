#pragma once

#include <jsi/jsi.h>
#include <RNSkReadonlyValue.h>

namespace RNSkia
{
using namespace facebook;

template <typename T>
class RNSkPropValue
{
public:
  RNSkPropValue() {}
  
  T getValue(jsi::Runtime &runtime) {
    if(_dynamicValue != nullptr) {
      return convert(runtime, _dynamicValue->getCurrent(runtime));
    }
    return _value;
  }
  
protected:
  void initialize(jsi::Runtime &runtime, const jsi::Value &props, const char* name) {
    if(!props.isObject()) {
      jsi::detail::throwJSError(runtime, "Properties is not an object.");
    }
    
    auto propsObject = props.asObject(runtime);
    auto prop = propsObject.getProperty(runtime, name);
    if(prop.isUndefined() || prop.isNull()) {
      jsi::detail::throwJSError(runtime, (std::string("Could not find property ") +
                                          std::string(name)).c_str());
    }
    
    // Now we have a property object - check if it is a host object
    if(prop.isObject() && prop.asObject(runtime).isHostObject<RNSkReadonlyValue>(runtime)) {
      auto dynamicValue = prop.asObject(runtime).asHostObject<RNSkReadonlyValue>(runtime);
      if(dynamicValue != nullptr) {
        _dynamicValue = dynamicValue;
      } else {
        jsi::detail::throwJSError(runtime, "Could not get Skia Value from property.");
      }
      return;
    }
    
    // Static value
    _value = convert(runtime, prop);
  }
  
  virtual T convert(jsi::Runtime &runtime, const jsi::Value &value) = 0;
  
private:
  T _value;
  std::shared_ptr<RNSkReadonlyValue> _dynamicValue;
};

class RNSkFloatPropValue: public RNSkPropValue<float> {
public:
  RNSkFloatPropValue(jsi::Runtime &runtime, const jsi::Value &props, const char* name):
  RNSkPropValue() {
    initialize(runtime, props, name);
  }
  
protected:
  float convert(jsi::Runtime &runtime, const jsi::Value &value) override {
    return static_cast<float>(value.asNumber());
  }
};

class RNSkIntPropValue: public RNSkPropValue<int> {
public:
  RNSkIntPropValue(jsi::Runtime &runtime, const jsi::Value &props, const char* name):
  RNSkPropValue() {
    initialize(runtime, props, name);
  }
  
protected:
  int convert(jsi::Runtime &runtime, const jsi::Value &value) override {
    return static_cast<int>(value.asNumber());
  }
};

template <typename T>
class RNSkHostObjectPropValue: public RNSkPropValue<std::shared_ptr<T>> {
public:
  RNSkHostObjectPropValue(jsi::Runtime &runtime, const jsi::Value &props, const char* name):
  RNSkPropValue<std::shared_ptr<T>>() {
    RNSkPropValue<std::shared_ptr<T>>::initialize(runtime, props, name);
  }
  
protected:
  std::shared_ptr<T> convert(jsi::Runtime &runtime, const jsi::Value &value) override {
    return value.asObject(runtime).asHostObject<T>(runtime);
  }
};
}
