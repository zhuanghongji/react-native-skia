

#pragma once

#include <jsi/jsi.h>
#include <RNSkBaseNode.h>

#include <RNSkRectNode.h>
#include <RNSkBaseDeclaration.h>
#include <RNSkPaintDeclaration.h>

#include <vector>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdocumentation"

#include <SkCanvas.h>

#pragma clang diagnostic pop
namespace RNSkia
{
  using namespace facebook;

  class RNSkReconciler
  {
  public:
    RNSkReconciler(jsi::Runtime &runtime, const jsi::Object &descriptor)
    {
      // Assert that this is a descriptor
      auto rootProp = descriptor.getProperty(runtime, "root");
      if (rootProp.isUndefined() || rootProp.isNull())
      {
        jsi::detail::throwJSError(runtime, "Expected root element in descriptor.");
      }
      // Decode the descriptor
      decode(runtime, descriptor);
    }
    
    void render(jsi::Runtime &runtime, SkCanvas *canvas, const int width, const int height)
    {
      // Update all declarations
      for (auto &declaration : _declarations)
      {
        declaration->update(runtime);
      }
      
      // Render all drawing operations
      for (auto &node : _nodes)
      {
        node->render(runtime, canvas, width, height);
      }
    }

  private:
    void decode(jsi::Runtime &runtime, const jsi::Object &descriptor)
    {
      _nodes.clear();

      auto childProp = descriptor.getProperty(runtime, "children");
      if (childProp.isUndefined() || childProp.isNull())
      {
        jsi::detail::throwJSError(runtime, "Expected children in descriptor.");
      }
      else
      {
        auto array = childProp.asObject(runtime).asArray(runtime);

        _paintStack.clear();

        for (size_t i = 0; i < array.size(runtime); ++i)
        {
          auto child = array.getValueAtIndex(runtime, i).asObject(runtime);
          tryDecodeAsDrawingDescriptor(runtime, child);
          tryDecodeAsDeclarationDescriptor(runtime, child);
        }
      }
    }

    void tryDecodeAsDrawingDescriptor(jsi::Runtime &runtime,
                                      jsi::Object &descriptor)
    {
      // Verify type of descriptor
      auto drawingTypeProp = descriptor.getProperty(runtime, "drawingType");
      if (drawingTypeProp.isUndefined() || drawingTypeProp.isNull())
      {
        return;
      }
      // Assert that props are set
      auto props = descriptor.getProperty(runtime, "props");
      if (props.isUndefined() || props.isNull())
      {
        jsi::detail::throwJSError(runtime, "Props not set on drawing descriptor.");
      }

      // Ensure paint declaration
      if (_paintStack.empty())
      {
        auto paintDeclaration = std::make_shared<RNSkPaintDeclaration>(runtime, jsi::Object(runtime));
        _declarations.emplace_back(paintDeclaration);
        _paintStack.emplace_back(paintDeclaration);
      }
      
      // Current paint
      auto currentPaint = _paintStack.back();
      
      // Now let's check if the node has paint props
      if(RNSkPaintProps::hasPaintProps(runtime, props)) {
        // We need to create our own paint declaration used for rendering
        // our node - and to make sure we keep the values in the current paint
        // as well.
        currentPaint = std::make_shared<RNSkPaintDeclaration>(runtime, props, currentPaint);
        _declarations.emplace_back(currentPaint);
      }

      // We have a drawing descriptor
      std::string drawingType = drawingTypeProp.asString(runtime).utf8(runtime);
      if (drawingType == "rect")
      {
        _nodes.emplace_back(std::make_shared<RNSkRectNode>(runtime, props, currentPaint));
      }
      else
      {
        jsi::detail::throwJSError(runtime, std::string("Unknown drawing type in descriptor: " + drawingType).c_str());
      }
    }

    void tryDecodeAsDeclarationDescriptor(jsi::Runtime &runtime, jsi::Object &descriptor)
    {
      auto prop = descriptor.getProperty(runtime, "declarationType");
      if (prop.isUndefined() || prop.isNull())
      {
        return;
      }
      // Assert that props are set
      auto props = descriptor.getProperty(runtime, "props");
      if (props.isUndefined() || props.isNull())
      {
        jsi::detail::throwJSError(runtime, "Props not set on drawing descriptor.");
      }

      // We have a declaration descriptor
      auto declarationType = prop.asString(runtime).utf8(runtime);

      if (declarationType == "paint")
      {
        auto paintDeclaration = std::make_shared<RNSkPaintDeclaration>(runtime, props);
        _declarations.emplace_back(paintDeclaration);
        _paintStack.emplace_back(paintDeclaration);
      }
    }

    std::vector<std::shared_ptr<RNSkPaintDeclaration>> _paintStack;
    std::vector<std::shared_ptr<RNSkBaseNode>> _nodes;
    std::vector<std::shared_ptr<RNSkBaseDeclaration>> _declarations;
};
}
