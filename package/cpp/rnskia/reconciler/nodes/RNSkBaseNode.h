#pragma once

#include <jsi/jsi.h>

#include <RNSkPaintDeclaration.h>

#include <stdexcept>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdocumentation"

#include <SkCanvas.h>

#pragma clang diagnostic pop

namespace RNSkia
{
using namespace facebook;

class RNSkBaseNode
{
public:
  RNSkBaseNode(std::shared_ptr<RNSkPaintDeclaration> paintDeclaration):
    paintDeclaration(paintDeclaration) {}

  virtual void render(jsi::Runtime &runtime, SkCanvas* canvas, const int width, const int height) {
    throw new std::runtime_error("Not implemented");
  }
  
protected:
  std::shared_ptr<RNSkPaintDeclaration> paintDeclaration;
};
}
