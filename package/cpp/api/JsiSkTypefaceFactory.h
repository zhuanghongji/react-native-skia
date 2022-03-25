#pragma once

#include "JsiSkTypeface.h"
#include "JsiSkHostObjects.h"
#include "JsiSkData.h"
#include <jsi/jsi.h>

namespace RNSkia {

    using namespace facebook;

    class JsiSkTypefaceFactory : public JsiSkHostObject {
    public:
        JSI_HOST_FUNCTION(MakeFreeTypeFaceFromData) {
          auto data = JsiSkData::fromValue(runtime, arguments[0]);
          auto typeface = SkFontMgr::RefDefault()->makeFromData(data);
          if(typeface == nullptr) {
            return jsi::Value::undefined();
          }
          return jsi::Object::createFromHostObject(
              runtime, std::make_shared<JsiSkTypeface>(getContext(), typeface));
        }

        JSI_EXPORT_FUNCTIONS(JSI_EXPORT_FUNC(JsiSkTypefaceFactory, MakeFreeTypeFaceFromData))

        JsiSkTypefaceFactory(std::shared_ptr<RNSkPlatformContext> context)
                : JsiSkHostObject(context) {}
    };

} // namespace RNSkia
