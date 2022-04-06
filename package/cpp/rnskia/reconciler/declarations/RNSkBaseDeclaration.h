#pragma once

#include <stdexcept>

#include <jsi/jsi.h>

namespace RNSkia
{
using namespace facebook;

class RNSkBaseDeclaration {
public:
  RNSkBaseDeclaration() {}
  
  virtual void update(jsi::Runtime &runtime) {
    throw new std::runtime_error("Not implemented");
  };
};

template <typename T>
class RNSkBaseDeclarationHolder: public RNSkBaseDeclaration {
public:
  RNSkBaseDeclarationHolder(std::shared_ptr<T> value): _value(value) {};
  const std::shared_ptr<T> getObject() { return _value; };
  
private:
  std::shared_ptr<T> _value;
};
}
