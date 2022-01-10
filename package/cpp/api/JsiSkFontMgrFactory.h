#pragma once

#include "JsiSkHostObjects.h"
#include <jsi/jsi.h>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdocumentation"

#include <SkFontMgr.h>
#include "JsiSkFontMgr.h"

#pragma clang diagnostic pop

namespace RNSkia {

    using namespace facebook;

    class JsiSkFontMgrFactory : public JsiSkHostObject {
    public:
        JSI_HOST_FUNCTION(FromURIs) {
            std::vector<std::string> uris;
            auto jsiURIs = arguments[0].asObject(runtime).asArray(runtime);
            auto urisSize = jsiURIs.size(runtime);
            for (int i = 0; i < urisSize; i++) {
                auto uri = jsiURIs.getValueAtIndex(runtime, i).asString(runtime).utf8(runtime);
                uris.push_back(uri);
            }
            auto fontMgr = SkFontMgr::RefDefault();

            return jsi::Object::createFromHostObject(
            runtime, std::make_shared<JsiSkFontMgr>(
            getContext(), fontMgr));
        }

        JSI_EXPORT_FUNCTIONS(JSI_EXPORT_FUNC(JsiSkFontMgrFactory, FromURIs))

        JsiSkFontMgrFactory(std::shared_ptr<RNSkPlatformContext> context)
                : JsiSkHostObject(context) {}
    };

} // namespace RNSkia
