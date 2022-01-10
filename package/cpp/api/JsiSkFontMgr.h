#pragma once

#include <JsiSkHostObjects.h>
#include <jsi/jsi.h>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdocumentation"

#include <SkFontMgr.h>

#pragma clang diagnostic pop

namespace RNSkia {

    using namespace facebook;

    class JsiSkFontMgr : public JsiSkWrappingSkPtrHostObject<SkFontMgr> {
    public:
        JsiSkFontMgr(std::shared_ptr<RNSkPlatformContext> context,
                    sk_sp<SkFontMgr> fontMgr)
                : JsiSkWrappingSkPtrHostObject<SkFontMgr>(context, fontMgr) {}

        JSI_PROPERTY_GET(__typename__) {
                return jsi::String::createFromUtf8(runtime, "FontMgr");
        }

        JSI_EXPORT_PROPERTY_GETTERS(JSI_EXPORT_PROP_GET(JsiSkFontMgr, __typename__))

        /**
          Returns the underlying object from a host object of this type
         */
        static sk_sp<SkFontMgr> fromValue(jsi::Runtime &runtime,
                                         const jsi::Value &obj) {
            return obj.asObject(runtime)
                    .asHostObject<JsiSkFontMgr>(runtime)
                    .get()
                    ->getObject();
        }
    };
} // namespace RNSkia
